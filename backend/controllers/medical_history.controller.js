const pool = require('../config/db');
const { medicalHistorySchema } = require('../validations/medical_history.validations');

// Retrieve all medical histories
const getMedicalHistories = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT * FROM medical_history
    `);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve a medical history by ID
const getMedicalHistoryById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query(`
      SELECT * FROM medical_history
      WHERE id = ?
    `, [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Medical history not found" });
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new medical history
const createMedicalHistory = async (req, res) => {
  const { patient_id, cardiac_issues, diabetes, hepatitis, drug_consumption, abnormal_blood_pressure, hiv, asthma, anemia, epilepsy, pregnancy, medication_consumption, medications_notes, allergies, allergies_notes, notes } = req.body;

  // Validate input data
  const { error } = medicalHistorySchema.validate({ patient_id, cardiac_issues, diabetes, hepatitis, drug_consumption, abnormal_blood_pressure, hiv, asthma, anemia, epilepsy, pregnancy, medication_consumption, medications_notes, allergies, allergies_notes, notes });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Insert into the database
    const sql = `
      INSERT INTO medical_history (patient_id, cardiac_issues, diabetes, hepatitis, drug_consumption, abnormal_blood_pressure, hiv, asthma, anemia, epilepsy, pregnancy, medication_consumption, medications_notes, allergies, allergies_notes, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [patient_id, cardiac_issues, diabetes, hepatitis, drug_consumption, abnormal_blood_pressure, hiv, asthma, anemia, epilepsy, pregnancy, medication_consumption, medications_notes, allergies, allergies_notes, notes];

    const [result] = await pool.query(sql, values);

    res.status(201).json({
      message: "Medical history created successfully",
      id: result.insertId,
    });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      res.status(404).json({ error: "Patient not found" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Update a medical history by ID
const updateMedicalHistoryById = async (req, res) => {
  const id = req.params.id;
  const { patient_id, cardiac_issues, diabetes, hepatitis, drug_consumption, abnormal_blood_pressure, hiv, asthma, anemia, epilepsy, pregnancy, medication_consumption, medications_notes, allergies, allergies_notes, notes } = req.body;

  // Validate input data
  const { error } = medicalHistorySchema.validate({ patient_id, cardiac_issues, diabetes, hepatitis, drug_consumption, abnormal_blood_pressure, hiv, asthma, anemia, epilepsy, pregnancy, medication_consumption, medications_notes, allergies, allergies_notes, notes });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Construct SQL dynamically
  let sql = "UPDATE medical_history SET ";
  const values = [];

  if (patient_id) {
    sql += "patient_id = ?, ";
    values.push(patient_id);
  }
  if (cardiac_issues !== undefined) {
    sql += "cardiac_issues = ?, ";
    values.push(cardiac_issues);
  }
  if (diabetes !== undefined) {
    sql += "diabetes = ?, ";
    values.push(diabetes);
  }
  if (hepatitis !== undefined) {
    sql += "hepatitis = ?, ";
    values.push(hepatitis);
  }
  if (drug_consumption !== undefined) {
    sql += "drug_consumption = ?, ";
    values.push(drug_consumption);
  }
  if (abnormal_blood_pressure !== undefined) {
    sql += "abnormal_blood_pressure = ?, ";
    values.push(abnormal_blood_pressure);
  }
  if (hiv !== undefined) {
    sql += "hiv = ?, ";
    values.push(hiv);
  }
  if (asthma !== undefined) {
    sql += "asthma = ?, ";
    values.push(asthma);
  }
  if (anemia !== undefined) {
    sql += "anemia = ?, ";
    values.push(anemia);
  }
  if (epilepsy !== undefined) {
    sql += "epilepsy = ?, ";
    values.push(epilepsy);
  }
  if (pregnancy !== undefined) {
    sql += "pregnancy = ?, ";
    values.push(pregnancy);
  }
  if (medication_consumption !== undefined) {
    sql += "medication_consumption = ?, ";
    values.push(medication_consumption);
  }
  if (medications_notes) {
    sql += "medications_notes = ?, ";
    values.push(medications_notes);
  }
  if (allergies !== undefined) {
    sql += "allergies = ?, ";
    values.push(allergies);
  }
  if (allergies_notes) {
    sql += "allergies_notes = ?, ";
    values.push(allergies_notes);
  }
  if (notes) {
    sql += "notes = ?, ";
    values.push(notes);
  }

  sql = sql.slice(0, -2); // Remove trailing comma and space
  sql += " WHERE id = ?";
  values.push(id);

  try {
    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Medical history not found" });
    }
    res.json({ message: "Medical history updated successfully" });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      res.status(404).json({ error: "Patient not found" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Delete a medical history by ID
const deleteMedicalHistoryById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query("DELETE FROM medical_history WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Medical history not found" });
    }
    res.json({ message: "Medical history deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getMedicalHistories,
  getMedicalHistoryById,
  createMedicalHistory,
  updateMedicalHistoryById,
  deleteMedicalHistoryById,
};
