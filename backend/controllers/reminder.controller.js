const pool = require('../config/db');

// Obtener todos los recordatorios
const getAllReminders = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM reminders');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve reminders' });
  }
};

// Obtener un recordatorio por ID
const getReminderById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM reminders WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve reminder' });
  }
};

// Crear un nuevo recordatorio
const createReminder = async (req, res) => {
  const { appointment_id, status } = req.body;
  try {
    const query = `
      INSERT INTO reminders (appointment_id, status)
      VALUES (?, ?)
    `;
    const [result] = await pool.execute(query, [appointment_id, status]);
    const newReminder = {
      id: result.insertId,
      appointment_id,
      sent_at: new Date(),
      status,
    };
    res.status(201).json(newReminder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create reminder' });
  }
};

// Actualizar un recordatorio por ID
const updateReminder = async (req, res) => {
  const { id } = req.params;
  const { status, response } = req.body;
  try {
    const query = `
      UPDATE reminders
      SET status = ?, response = ?
      WHERE id = ?
    `;
    const [result] = await pool.execute(query, [status, response, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    res.json({ message: 'Reminder updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update reminder' });
  }
};

// Eliminar un recordatorio por ID
const deleteReminder = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM reminders WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete reminder' });
  }
};

module.exports = {
  getAllReminders,
  getReminderById,
  createReminder,
  updateReminder,
  deleteReminder,
};
