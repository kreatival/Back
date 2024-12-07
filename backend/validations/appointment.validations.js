const Joi = require("joi");
const pool = require("../config/db");
const moment = require("moment");

// Esquema general para citas
const appointmentSchema = Joi.object({
  patient_id: Joi.number().integer().required(),
  dentist_id: Joi.number().integer().required(),
  reason_id: Joi.number().integer().required(),
  date: Joi.date().iso().required(),
  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  state: Joi.string()
    .valid("confirmed", "pending", "rescheduled", "cancelled")
    .optional(),
  observations: Joi.string().optional(),
  assistance: Joi.string()
  .valid("pending", "present", "absent")
  .optional(),
  anticipation_time: Joi.number()
    .integer()
    .min(0)
    .max(72 * 60)
    .optional(),
  is_active: Joi.boolean().required().optional(),
});

// Esquema general para citas
const appointmentPatchSchema = Joi.object({
  patient_id: Joi.number().integer().optional(),
  dentist_id: Joi.number().integer().optional(),
  reason_id: Joi.number().integer().optional(),
  date: Joi.date().iso().optional(),
  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
  state: Joi.string()
    .valid("confirmed", "pending", "rescheduled", "cancelled")
    .optional(),
  observations: Joi.string().optional(),
  assistance: Joi.string()
  .valid("pending", "present", "absent")
  .optional(),
  anticipation_time: Joi.number()
    .integer()
    .min(0)
    .max(72 * 60)
    .optional(),
  is_active: Joi.boolean().optional().optional(),
});

// Validar la existencia del paciente
const validatePatientExists = async (patient_id) => {
  const patientSql = `SELECT COUNT(*) AS count FROM patients WHERE id = ?`;
  const [patientResult] = await pool.query(patientSql, [patient_id]);
  if (patientResult[0].count === 0) {
    throw new Error("Patient not found");
  }
};

// Validar la existencia del dentista
const validateDentistExists = async (dentist_id) => {
  const dentistSql = `SELECT COUNT(*) AS count FROM users WHERE id = ?`;
  const [dentistResult] = await pool.query(dentistSql, [dentist_id]);
  if (dentistResult[0].count === 0) {
    throw new Error("Dentist not found");
  }
};

// Validar la existencia del motivo (reason)
const validateReasonExistsAndGetDuration = async (reason_id) => {
  const reasonSql = `SELECT time FROM reasons WHERE id = ?`;
  const [reasonResult] = await pool.query(reasonSql, [reason_id]);
  if (reasonResult.length === 0) {
    throw new Error("Reason not found");
  }
  return reasonResult[0].time; // Duración en minutos
};

// Validar que no haya conflictos de turnos
const validateAppointmentConflict = async (
  dentist_id,
  formattedDate,
  formattedTime
) => {
  const checkSql = `
    SELECT COUNT(*) AS count
    FROM appointments
    WHERE dentist_id = ? AND date = ? AND time = ? AND state NOT IN ('cancelled', 'rescheduled', 'pending')
  `;
  const [checkResult] = await pool.query(checkSql, [
    dentist_id,
    formattedDate,
    formattedTime,
  ]);

  if (checkResult[0].count > 0) {
    throw new Error("Appointment slot already taken");
  }
};

// Función para validar si un nuevo turno se solapa con los existentes
const validateNoOverlappingAppointments = (
  appointments,
  formattedTime,
  duration
) => {
  for (const appointment of appointments) {
    const startExisting = moment(appointment.start_time, "HH:mm:ss");
    const endExisting = startExisting
      .clone()
      .add(moment.duration(appointment.duration_in_minutes));

    const startNew = moment(formattedTime, "HH:mm:ss");
    const endNew = startNew.clone().add(duration, "minutes");

    if (startNew.isBefore(endExisting) && endNew.isAfter(startExisting)) {
      throw new Error(
        "The new appointment overlaps with an existing appointment."
      );
    }
  }
};

module.exports = {
  appointmentSchema,
  appointmentPatchSchema,
  validatePatientExists,
  validateDentistExists,
  validateReasonExistsAndGetDuration,
  validateAppointmentConflict,
  validateNoOverlappingAppointments,
};
