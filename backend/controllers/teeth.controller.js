const pool = require('../config/db');
const { toothSchema } = require('../validations/teeth.validations');

// Obtener todos los dientes
const getTeeth = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM teeth');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un diente por ID
const getToothById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('SELECT * FROM teeth WHERE id = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Tooth not found" });
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear un nuevo diente
const createTooth = async (req, res) => {
  const { odontogram_id, tooth_number, general_condition, mesial_side, distal_side, buccal_side, lingual_side, center } = req.body;

  // Validaciones
  const { error } = toothSchema.validate({ odontogram_id, tooth_number, general_condition, mesial_side, distal_side, buccal_side, lingual_side, center });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const sql = `
      INSERT INTO teeth (odontogram_id, tooth_number, general_condition, mesial_side, distal_side, buccal_side, lingual_side, center)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [odontogram_id, tooth_number, general_condition, mesial_side, distal_side, buccal_side, lingual_side, center];

    const [result] = await pool.query(sql, values);
    res.status(201).json({
      message: "Tooth created successfully",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un diente por ID
const updateToothById = async (req, res) => {
  const id = req.params.id;
  const { odontogram_id, tooth_number, general_condition, mesial_side, distal_side, buccal_side, lingual_side, center } = req.body;

  // Validaciones
  const { error } = toothSchema.validate({ odontogram_id, tooth_number, general_condition, mesial_side, distal_side, buccal_side, lingual_side, center });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const sql = `
    UPDATE teeth
    SET odontogram_id = ?, tooth_number = ?, general_condition = ?, mesial_side = ?, distal_side = ?, buccal_side = ?, lingual_side = ?, center = ?
    WHERE id = ?
  `;
  const values = [odontogram_id, tooth_number, general_condition, mesial_side, distal_side, buccal_side, lingual_side, center, id];

  try {
    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tooth not found" });
    }
    res.json({ message: "Tooth updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar parcialmente un diente por ID
const patchToothById = async (req, res) => {
  const id = req.params.id;
  const { odontogram_id, tooth_number, general_condition, mesial_side, distal_side, buccal_side, lingual_side, center } = req.body;

  // Validaciones
  const { error } = toothSchema.validate({ odontogram_id, tooth_number, general_condition, mesial_side, distal_side, buccal_side, lingual_side, center });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  let sql = "UPDATE teeth SET ";
  const values = [];

  if (odontogram_id) {
    sql += "odontogram_id = ?, ";
    values.push(odontogram_id);
  }
  if (tooth_number) {
    sql += "tooth_number = ?, ";
    values.push(tooth_number);
  }
  if (general_condition) {
    sql += "general_condition = ?, ";
    values.push(general_condition);
  }
  if (mesial_side) {
    sql += "mesial_side = ?, ";
    values.push(mesial_side);
  }
  if (distal_side) {
    sql += "distal_side = ?, ";
    values.push(distal_side);
  }
  if (buccal_side) {
    sql += "buccal_side = ?, ";
    values.push(buccal_side);
  }
  if (lingual_side) {
    sql += "lingual_side = ?, ";
    values.push(lingual_side);
  }
  if (center) {
    sql += "center = ?, ";
    values.push(center);
  }

  sql = sql.slice(0, -2); // Remove trailing comma and space
  sql += " WHERE id = ?";
  values.push(id);

  try {
    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tooth not found" });
    }
    res.json({ message: "Tooth updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un diente por ID
const deleteToothById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM teeth WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tooth not found" });
    }
    res.json({ message: "Tooth deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTeeth,
  getToothById,
  createTooth,
  updateToothById,
  patchToothById,
  deleteToothById,
};
