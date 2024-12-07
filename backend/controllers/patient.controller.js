const pool = require("../config/db");
const moment = require('moment');
const patientSchema = require('../validations/patient.validations'); // Ajusta la ruta según sea necesario

// Obtener todos los pacientes
const getPatients = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM patients");

    // Formatear las fechas
    results.forEach(user => {
      user.birth_date = moment(user.birth_date).format('DD/MM/YYYY');
      user.created_at = moment(user.created_at).format('DD/MM/YYYY:HH:mm:ss');
      user.updated_at = moment(user.updated_at).format('DD/MM/YYYY:HH:mm:ss');
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener paciente por ID
const getPatientById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query("SELECT * FROM patients WHERE id = ?", [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    // Formatear las fechas
    result[0].birth_date = moment(result[0].birth_date).format('DD/MM/YYYY');
    result[0].created_at = moment(result[0].created_at).format('DD/MM/YYYY:HH:mm:ss');
    result[0].updated_at = moment(result[0].updated_at).format('DD/MM/YYYY:HH:mm:ss');

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear un nuevo paciente
const createPatient = async (req, res) => {
  const { error } = patientSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { first_name, last_name, birth_date, dni, phone_number, alternative_phone_number, email } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO patients (first_name, last_name, birth_date, dni, phone_number, alternative_phone_number, email)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, birth_date, dni, phone_number, alternative_phone_number, email]
    );
    
    res.status(201).json({
      message: "Patient created successfully",
      id: result.insertId,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Duplicate entry for email or dni" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Borrar paciente
const deletePatientById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query("DELETE FROM patients WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar paciente
const updatePatientById = async (req, res) => {
  const id = req.params.id;
  const { error } = patientSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { first_name, last_name, birth_date, dni, phone_number, alternative_phone_number, email } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE patients 
       SET first_name = ?, last_name = ?, birth_date = ?, dni = ?, phone_number = ?, alternative_phone_number = ?, email = ? 
       WHERE id = ?`,
      [first_name, last_name, birth_date, dni, phone_number, alternative_phone_number, email, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json({ message: "Patient updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener los pacientes segun dentista
const getPatientsByDentistId = async (req, res) => {
  const dentistId = req.params.dentist_id;

  try {
    const [results] = await pool.query(
      `
      SELECT DISTINCT p.*
      FROM patients p
      JOIN appointments a ON p.id = a.patient_id
      WHERE a.dentist_id = ?
    `,
      [dentistId]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "No patients found for this dentist" });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  deletePatientById,
  updatePatientById,
  getPatientsByDentistId,
};
