const pool = require("../config/db");
const moment = require("moment");
const reasonSchema = require('../validations/reason.validations'); // Ajusta la ruta según sea necesario

//  Obtener todos los motivos
const getReasons = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM reasons");

    // Formatear las fechas
    results.forEach((user) => {
      user.time = moment(user.time, "HH:mm:ss").format("HH:mm");
      user.created_at = moment(user.created_at).format("DD/MM/YYYY:HH:mm:ss");
      user.updated_at = moment(user.updated_at).format("DD/MM/YYYY:HH:mm:ss");
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener motivo por ID
const getReasonById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query("SELECT * FROM reasons WHERE id = ?", [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Reason not found" });
    }
    result[0].time = moment(result[0].time, "HH:mm:ss").format("HH:mm");
    result[0].created_at = moment(result[0].created_at).format("DD/MM/YYYY:HH:mm:ss");
    result[0].updated_at = moment(result[0].updated_at).format("DD/MM/YYYY:HH:mm:ss");

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear un nuevo motivo
const createReason = async (req, res) => {
  const { error } = reasonSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { description, time } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO reasons (description, time) VALUES (?, ?)",
      [description, time]
    );
    res.status(201).json({
      message: "Reason created successfully",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Actualizar motivo 
const updateReasonById = async (req, res) => {
  const id = req.params.id;
  const { error } = reasonSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { description, time } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE reasons SET description = ?, time = ? WHERE id = ?",
      [description, time, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reason not found" });
    }
    res.json({ message: "Reason updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Borrar motivo
const deleteReasonById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query("DELETE FROM reasons WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reason not found" });
    }
    res.json({ message: "Reason deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getReasons,
  getReasonById,
  createReason,
  updateReasonById,
  deleteReasonById,
};
