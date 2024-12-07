const pool = require("../config/db");

// Obtener todas las configuraciones de los recordatorios
const getReminderConfigurations = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT rc.*
      FROM reminder_configurations rc
      JOIN appointments a ON rc.appointment_id = a.id
      JOIN patients p ON a.patient_id = p.id
    `);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener configuracion de recordatorio por ID
const getReminderConfigurationById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query(
      `
      SELECT rc.*
      FROM reminder_configurations rc
      JOIN appointments a ON rc.appointment_id = a.id
      JOIN patients p ON a.patient_id = p.id
      WHERE rc.id = ?
    `,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Reminder configuration not found" });
    }

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear una nueva configuracion
const createReminderConfiguration = async (req, res) => {
  console.log(req.body);
  const { appointment_id, anticipation_time, is_active } = req.body;

  // Validate required fields
  if (!appointment_id || is_active === undefined) {
    return res.status(400).json({ error: "Appointment ID and is_active are required" });
  }

  // Set default value for anticipation_time if not provided
  const anticipationTime = anticipation_time || '00:00:00';

  try {
    const sql = `
      INSERT INTO reminder_configurations (appointment_id, anticipation_time, is_active)
      VALUES (?, ?, ?)
    `;
    const values = [appointment_id, anticipationTime, is_active];

    const [result] = await pool.query(sql, values);
    res.status(201).json({
      message: "Reminder configuration created successfully",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar una configuración de recordatorio por ID
const updateReminderConfigurationById = async (req, res) => {
  const id = req.params.id;
  const { appointment_id, anticipation_time, is_active } = req.body;

  // Validar que al menos un campo sea proporcionado
  if (appointment_id === undefined && anticipation_time === undefined && is_active === undefined) {
    return res.status(400).json({ error: "At least one field is required to update" });
  }

  try {
    const result = await updateReminderConfig(id, appointment_id, anticipation_time, is_active);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reminder configuration not found" });
    }

    res.json({ message: "Reminder configuration updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Borrar configuracion
const deleteReminderConfigurationById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query("DELETE FROM reminder_configurations WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reminder configuration not found" });
    }
    res.json({ message: "Reminder configuration deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//---------------------------------------------------------------------------------------------------

// Función para crear una nueva configuración de recordatorio
const createReminderConfig = async (appointment_id, anticipation_time, is_active) => {
  const sql = `
    INSERT INTO reminder_configurations (appointment_id, anticipation_time, is_active)
    VALUES (?, ?, ?)
  `;
  const values = [appointment_id, anticipation_time, is_active];
  const [result] = await pool.query(sql, values);
  return result.insertId;
};

// Función para actualizar una configuración de recordatorio
const updateReminderConfig = async (id, appointment_id, anticipation_time, is_active) => {
  let sql = "UPDATE reminder_configurations SET ";
  const values = [];

  if (appointment_id !== undefined) {
    sql += "appointment_id = ?, ";
    values.push(appointment_id);
  }
  if (anticipation_time !== undefined) {
    sql += "anticipation_time = ?, ";
    values.push(anticipation_time);
  }
  if (is_active !== undefined) {
    sql += "is_active = ?, ";
    values.push(is_active);
  }

  // Eliminar la última coma y espacio de la consulta SQL
  sql = sql.slice(0, -2);

  sql += " WHERE id = ?";
  values.push(id);

  try {
    const [result] = await pool.query(sql, values);
    return result; // Devolver el resultado de la consulta
  } catch (err) {
    throw err; // Lanzar el error para que pueda ser capturado por el controlador
  }
};

module.exports = {
  getReminderConfigurations,
  getReminderConfigurationById,
  createReminderConfiguration,
  updateReminderConfigurationById,
  deleteReminderConfigurationById,
  createReminderConfig,
  updateReminderConfig
};
