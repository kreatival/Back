const pool = require("../config/db");
const moment = require("moment");
const appointmentValidations = require("../validations/appointment.validations");
const reminder_configurations = require("./reminder_configurations.controller");
const emailController = require("./email.controller");

// Obtener todos los turnos 
const getAppointments = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT a.*, p.first_name AS patient_name, d.first_name AS dentist_name, r.time AS reason_duration
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users d ON a.dentist_id = d.id
      JOIN reasons r ON a.reason_id = r.id
    `);

    // Formatear las fechas, horas y calcular ending_time
    const formattedResults = results.map((appointment) => {
      const endingTime = moment(appointment.time, "HH:mm:ss")
        .add(appointment.reason_duration, "minutes")
        .format("HH:mm");

      return {
        id: appointment.id,
        patient_id: appointment.patient_id,
        dentist_id: appointment.dentist_id,
        reason_id: appointment.reason_id,
        date: moment(appointment.date).format("DD-MM-YYYY"),
        time: moment(appointment.time, "HH:mm:ss").format("HH:mm"),
        ending_time: endingTime,
        state: appointment.state,
        assistance: appointment.assistance,
        observations: appointment.observations,
        patient_name: appointment.patient_name,
        dentist_name: appointment.dentist_name,
        created_at: moment(appointment.created_at).format(
          "DD-MM-YYYY:HH:mm:ss"
        ),
        updated_at: moment(appointment.updated_at).format(
          "DD-MM-YYYY:HH:mm:ss"
        ),
      };
    });
    res.json(formattedResults);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener turno por ID
const getAppointmentById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query(
      `
      SELECT a.*, p.first_name AS patient_name, d.first_name AS dentist_name, r.time AS reason_duration
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users d ON a.dentist_id = d.id
      JOIN reasons r ON a.reason_id = r.id
      WHERE a.id = ?
    `,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const appointment = result[0];

    // Calcular ending_time y formatear las propiedades date y time
    const endingTime = moment(appointment.time, "HH:mm:ss")
      .add(appointment.reason_duration, "minutes")
      .format("HH:mm");

    const formattedAppointment = {
      id: appointment.id,
      patient_id: appointment.patient_id,
      dentist_id: appointment.dentist_id,
      reason_id: appointment.reason_id,
      date: moment(appointment.date).format("DD-MM-YYYY"),
      time: moment(appointment.time, "HH:mm:ss").format("HH:mm"),
      ending_time: endingTime,
      state: appointment.state,
      assistance: appointment.assistance,
      observations: appointment.observations,
      patient_name: appointment.patient_name,
      dentist_name: appointment.dentist_name,
      created_at: moment(appointment.created_at).format("DD-MM-YYYY:HH:mm:ss"),
      updated_at: moment(appointment.updated_at).format("DD-MM-YYYY:HH:mm:ss"),
    };

    res.json(formattedAppointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear un nuevo turno
const createAppointment = async (req, res) => {
  // Validar el cuerpo de la solicitud
  const { error } = appointmentValidations.appointmentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const {
    patient_id,
    dentist_id,
    reason_id,
    date,
    time,
    state,
    observations,
    anticipation_time,
    is_active,
  } = req.body;

  // Ajustar el estado si is_active es true
  const finalState = is_active ? "pending" : state;

  try {
    // Validar la existencia del paciente, dentista y motivo
    await appointmentValidations.validatePatientExists(patient_id);
    await appointmentValidations.validateDentistExists(dentist_id);
    const duration =
      await appointmentValidations.validateReasonExistsAndGetDuration(
        reason_id
      );

    // Validar conflictos de turnos
    await appointmentValidations.validateAppointmentConflict(dentist_id, date, time);

    const appointments = await getAppointmentsForDentist(
      date,
      dentist_id
    );
    appointmentValidations.validateNoOverlappingAppointments(appointments, time, duration);

    // Insertar el nuevo turno
    const sql = `
      INSERT INTO appointments (patient_id, dentist_id, reason_id, date, time, state, observations, assistance)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      patient_id,
      dentist_id,
      reason_id,
      date,
      time,
      finalState, 
      observations,
      null,
    ];

    const [result] = await pool.query(sql, values);
    const appointment_id = result.insertId;

    // Si hay una configuración de recordatorio, crear o actualizar la configuración
    if (is_active) {
      await reminder_configurations.createReminderConfig(
        appointment_id,
        anticipation_time,
        is_active
      );
    }

    res.status(201).json({
      message: "Appointment created successfully",
      id: appointment_id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar turno 
const updateAppointmentById = async (req, res) => {
  const id = req.params.id;
  const {
    patient_id,
    dentist_id,
    reason_id,
    date,
    time,
    state,
    observations,
    assistance,
    anticipation_time,
    is_active,
  } = req.body;

  // Validar el cuerpo de la solicitud
  const { error } = appointmentValidations.appointmentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
 
  // Ajustar el estado si is_active es true
  const finalState = is_active ? "pending" : state;

  try {
    // Validar la existencia del paciente, dentista y motivo si se proporcionaron
    if (patient_id)
      await appointmentValidations.validatePatientExists(patient_id);
    if (dentist_id)
      await appointmentValidations.validateDentistExists(dentist_id);
    const duration = reason_id
      ? await appointmentValidations.validateReasonExistsAndGetDuration(
          reason_id
        )
      : null;

    // Validar conflictos de turnos si se proporciona una nueva fecha y hora
    if (dentist_id && date && time) {
      await appointmentValidations.validateAppointmentConflict(
        dentist_id,
        date,
        time
      );

      const appointments = await getAppointmentsForDentist(
        date,
        dentist_id
      );
      appointmentValidations.validateNoOverlappingAppointments(appointments, time, duration);
    }

    let sql ="UPDATE appointments SET patient_id = ?, dentist_id = ?, reason_id = ?, date = ?, time = ?, state = ?, observations = ?, assistance = ? WHERE id = ?";
    const values = [patient_id, dentist_id, reason_id, date, time, finalState, observations, assistance, id];

    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verificar y actualizar o crear configuración de recordatorio si está activa
    if (is_active) {
      const [existingReminderConfigs] = await pool.query(
        `SELECT id FROM reminder_configurations WHERE appointment_id = ?`,
        [id]
      );

      if (existingReminderConfigs.length > 0) {
        await reminder_configurations.updateReminderConfig(
          id,
          anticipation_time,
          is_active
        );
      } else {
        await reminder_configurations.createReminderConfig(
          id,
          anticipation_time,
          is_active
        );
      }
    }

    res.json({ message: "Appointment updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar turno parcialmente
const patchAppointmentById = async (req, res) => {
  const id = req.params.id;
  const {
    patient_id,
    dentist_id,
    reason_id,
    date,
    time,
    state,
    observations,
    assistance,
    anticipation_time,
    is_active,
  } = req.body;

  // Validar el cuerpo de la solicitud
  const { error } = appointmentValidations.appointmentPatchSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Ajustar el estado si is_active es false
  const finalState = is_active ? state : "confirmed";

  let sql = "UPDATE appointments SET ";
  const values = [];

  if (patient_id) {
    sql += "patient_id = ?, ";
    values.push(patient_id);
  }
  if (dentist_id) {
    sql += "dentist_id = ?, ";
    values.push(dentist_id);
  }
  if (reason_id) {
    sql += "reason_id = ?, ";
    values.push(reason_id);
  }
  if (date) {
    sql += "date = ?, ";
    values.push(date);
  }
  if (time) {
    sql += "time = ?, ";
    values.push(time);
  }
  if (state) {
    sql += "state = ?, ";
    values.push(finalState);
  }
  if (observations) {
    sql += "observations = ?, ";
    values.push(observations);
  }
  if (assistance) {
    sql += "assistance = ?, ";
    values.push(assistance);
  }

  // Eliminar la última coma y espacio del SQL
  sql = sql.slice(0, -2);

  sql += " WHERE id = ?";
  values.push(id);

  try {
    // Verificar si el nuevo horario está disponible
    if (date && time) {
      const [existingAppointments] = await pool.query(
        `SELECT id FROM appointments
         WHERE dentist_id = ? AND date = ? AND time = ? AND id <> ? AND state NOT IN ('cancelled', 'rescheduled', 'pending')`,
        [dentist_id, date, time, id]
      );

      if (existingAppointments.length > 0) {
        return res
          .status(409)
          .json({ error: "Appointment slot already taken" });
      }
    }

    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verificar y actualizar o crear configuración de recordatorio
    if (is_active) {
      // Buscar configuración de recordatorio existente para la cita
      const [existingReminderConfigs] = await pool.query(
        `SELECT id FROM reminder_configurations WHERE appointment_id = ?`,
        [id]
      );

      if (existingReminderConfigs.length > 0) {
        // Actualizar configuración de recordatorio existente
        await reminder_configurations.updateReminderConfig(
          id,
          anticipation_time,
          is_active
        );
      }
    }

    res.json({ message: "Appointment updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Borrar turno
const deleteAppointmentById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query("DELETE FROM appointments WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener turnos segun dentista y estado del turno
const getAppointmentsByDentistIdAndState = async (req, res) => {
  const dentistId = req.params.dentist_id;
  const state = req.query.state;

  // Validación del ID del odontólogo
  if (!dentistId) {
    return res.status(400).json({ error: "Dentist ID is required" });
  }

  try {
    // Verificar si existe el dentista
    const dentistCheckQuery =
      'SELECT COUNT(*) AS count FROM users WHERE id = ? AND role_id = (SELECT id FROM roles WHERE name = "dentist")';
    const [dentistCheckResult] = await pool.query(dentistCheckQuery, [
      dentistId,
    ]);

    if (dentistCheckResult[0].count === 0) {
      return res.status(404).json({ error: "Invalid dentist ID" });
    }

    let query = `
      SELECT a.*, p.first_name AS patient_name, p.last_name AS patient_last_name, d.first_name AS dentist_name, d.last_name AS dentist_last_name, r.time AS reason_duration
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users d ON a.dentist_id = d.id
      JOIN reasons r ON a.reason_id = r.id
      WHERE a.dentist_id = ?
    `;

    const queryParams = [dentistId];

    if (state) {
      query += " AND a.state = ?";
      queryParams.push(state);
    }

    const [results] = await pool.query(query, queryParams);

    // Formatear las fechas, horas y calcular ending_time
    const formattedResults = results.map((appointment) => {
      const endingTime = moment(appointment.time, "HH:mm:ss")
        .add(appointment.reason_duration, "minutes")
        .format("HH:mm");

      return {
        id: appointment.id,
        patient_id: appointment.patient_id,
        dentist_id: appointment.dentist_id,
        reason_id: appointment.reason_id,
        date: moment(appointment.date).format("DD-MM-YYYY"),
        time: moment(appointment.time, "HH:mm:ss").format("HH:mm"),
        ending_time: endingTime,
        state: appointment.state,
        assistance: appointment.assistance,
        observations: appointment.observations,
        patient_name: appointment.patient_name,
        patient_last_name: appointment.patient_last_name,
        dentist_name: appointment.dentist_name,
        dentist_last_name: appointment.dentist_last_name,

        created_at: moment(appointment.created_at).format(
          "DD-MM-YYYY:HH:mm:ss"
        ),
        updated_at: moment(appointment.updated_at).format(
          "DD-MM-YYYY:HH:mm:ss"
        ),
      };
    });

    res.json(formattedResults);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Función para obtener los turnos existentes de un paciente
const getAppointmentsByPatientId = async (req, res) => {
  const patientId = req.params.patient_id;

  // Validación del ID del paciente
  if (!patientId) {
    return res.status(400).json({ error: "Patient ID is required" });
  }

  try {
    const [results] = await pool.query(
      `
      SELECT a.*, p.first_name AS patient_name, d.first_name AS dentist_name, r.time AS reason_duration
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users d ON a.dentist_id = d.id
      JOIN reasons r ON a.reason_id = r.id
      WHERE a.patient_id = ?
    `,
      [patientId]
    );

    // Formatear las fechas, horas y calcular ending_time
    const formattedResults = results.map((appointment) => {
      const endingTime = moment(appointment.time, "HH:mm:ss")
        .add(appointment.reason_duration, "minutes")
        .format("HH:mm");

      return {
        id: appointment.id,
        patient_id: appointment.patient_id,
        dentist_id: appointment.dentist_id,
        reason_id: appointment.reason_id,
        date: moment(appointment.date).format("DD-MM-YYYY"),
        time: moment(appointment.time, "HH:mm:ss").format("HH:mm"),
        ending_time: endingTime,
        state: appointment.state,
        assistance: appointment.assistance,
        observations: appointment.observations,
        patient_name: appointment.patient_name,
        dentist_name: appointment.dentist_name,
        created_at: moment(appointment.created_at).format(
          "DD-MM-YYYY:HH:mm:ss"
        ),
        updated_at: moment(appointment.updated_at).format(
          "DD-MM-YYYY:HH:mm:ss"
        ),
      };
    });

    res.json(formattedResults);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Función para obtener los turnos existentes de un dentista en una fecha específica
const getAppointmentsForDentist = async (date, dentist_id) => {
  const appointmentsSql = `
    SELECT 
        a.id AS appointment_id,
        a.time AS start_time,
        r.time AS duration_in_minutes
    FROM 
        appointments a
    JOIN 
        reasons r ON a.reason_id = r.id
    WHERE 
        a.date = ? AND a.dentist_id = ?    
    ORDER BY 
        a.time;
  `;

  const [appointmentsResult] = await pool.query(appointmentsSql, [
    date,
    dentist_id,
  ]);
  return appointmentsResult;
};

// Nueva función para obtener los turnos confirmados de un paciente
const getConfirmedAppointmentsByPatientId = async (req, res) => {
  const patientId = req.params.patient_id;

  // Validación del ID del paciente
  if (!patientId) {
    return res.status(400).json({ error: "Patient ID is required" });
  }

  try {
    const [results] = await pool.query(
      `
      SELECT a.date, a.time, r.description AS reason
      FROM appointments a
      JOIN reasons r ON a.reason_id = r.id
      WHERE a.patient_id = ? AND a.assistance = "present"
      ORDER BY a.date DESC, a.time DESC
    `,
      [patientId]
    );

    // Formatear las fechas y horas
    const formattedResults = results.map((appointment) => ({
      date: moment(appointment.date).format("DD-MM-YYYY"),
      time: moment(appointment.time, "HH:mm").format("HH:mm"),
      reason: appointment.reason,
    }));

    res.json(formattedResults);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAppointmentStatus = async (req, res, status) => {
  const appointmentId = req.params.id;

  try {
    // Verificar si ya existe una respuesta en el recordatorio
    const [reminderCheckResult] = await pool.query(
      'SELECT response FROM reminders WHERE appointment_id = ?',
      [appointmentId]
    );

    if (reminderCheckResult.length > 0 && reminderCheckResult[0].response) {
      return res.status(400).send('Ya se ha registrado una respuesta para este turno.');
    }

    // Actualizar el estado de la cita en la base de datos
    const [appointmentResult] = await pool.query(
      'UPDATE appointments SET state = ? WHERE id = ?',
      [status, appointmentId]
    );

    if (appointmentResult.affectedRows > 0) {
      let message;
      let emailAction;

      // Determinar el mensaje y la acción del correo basado en el estado
      switch (status) {
        case 'confirmed':
          message = 'Tu turno ha sido confirmado. Puede cerrar esta pestaña.';
          emailAction = 'confirm';
          break;
        case 'cancelled':
          message = 'Tu turno ha sido cancelado. Puede cerrar esta pestaña.';
          emailAction = 'cancel';
          break;
        case 'rescheduled':
          message = 'Tu solicitud de reprogramación ha sido recibida. Puede cerrar esta pestaña.';
          emailAction = 'reschedule';
          break;
        default:
          message = 'Estado de cita actualizado. Puede cerrar esta pestaña.';
      }

      // Actualizar el campo response en la tabla reminders
      const [reminderResult] = await pool.query(
        'UPDATE reminders SET response = ? WHERE appointment_id = ?',
        [status, appointmentId]
      );

      if (reminderResult.affectedRows > 0) {
        // Enviar un correo electrónico al paciente
        try {
          await emailController.sendEmailResponse(appointmentId, emailAction);
        } catch (emailError) {
          console.error('Error al enviar el correo electrónico:', emailError);
          return res.status(500).send('Error al enviar el correo electrónico.');
        }
        res.send(message);
      } else {
        res.status(404).send('Recordatorio no encontrado.');
      }
    } else {
      res.status(404).send('Turno no encontrado.');
    }
  } catch (error) {
    console.error('Error al actualizar el estado del turno:', error);
    res.status(500).send('Error al actualizar el turno.');
  } 
};




module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentById,
  patchAppointmentById,
  deleteAppointmentById,
  getAppointmentsByDentistIdAndState,
  getAppointmentsByPatientId,
  getConfirmedAppointmentsByPatientId,
  updateAppointmentStatus
};
