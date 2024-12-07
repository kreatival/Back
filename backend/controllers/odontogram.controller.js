const pool = require('../config/db');
const moment = require('moment');
const { odontogramSchema } = require('../validations/odontogram.validations');

// Obtener todos los odontogramas
const getOdontograms = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT * FROM odontograms
    `);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un odontograma por ID
const getOdontogramById = async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await pool.query(`
      SELECT * FROM odontograms WHERE id = ?
    `, [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Odontogram not found" });
    }

    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear un nuevo odontograma
const createOdontogram = async (req, res) => {
  const { appointment_id, patient_id, date, type, notes } = req.body;

  // Validar los datos de entrada
  const { error } = odontogramSchema.validate({ appointment_id, patient_id, date, type, notes });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const formattedDate = moment(date, ['YYYY-MM-DD', 'DD/MM/YYYY']).format('YYYY-MM-DD');

  try {
    const [result] = await pool.query(`
      INSERT INTO odontograms (appointment_id, patient_id, date, type, notes)
      VALUES (?, ?, ?, ?, ?)
    `, [appointment_id, patient_id, formattedDate, type, notes]);

    res.status(201).json({
      message: "Odontogram created successfully",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un odontograma por ID
const updateOdontogramById = async (req, res) => {
  const id = req.params.id;
  const { appointment_id, patient_id, date, type, notes } = req.body;

  // Validar los datos de entrada
  const { error } = odontogramSchema.validate({ appointment_id, patient_id, date, type, notes });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const formattedDate = date ? moment(date, ['YYYY-MM-DD', 'DD/MM/YYYY']).format('YYYY-MM-DD') : null;

  try {
    const [result] = await pool.query(`
      UPDATE odontograms
      SET appointment_id = ?, patient_id = ?, date = ?, type = ?, notes = ?
      WHERE id = ?
    `, [appointment_id, patient_id, formattedDate, type, notes, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Odontogram not found" });
    }
    res.json({ message: "Odontogram updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un odontograma por ID
const deleteOdontogramById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query(`
      DELETE FROM odontograms WHERE id = ?
    `, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Odontogram not found" });
    }
    res.json({ message: "Odontogram deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getOdontograms,
  getOdontogramById,
  createOdontogram,
  updateOdontogramById,
  deleteOdontogramById,
};
