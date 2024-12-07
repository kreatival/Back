const pool = require('../config/db');
const moment = require('moment');
const roleSchema = require('../validations/role.validations'); // Ajusta la ruta según sea necesario

//  Obtener todos los roles
const getRoles = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM roles');
    // Formatear las fechas
    results.forEach((user) => {
      user.created_at = moment(user.created_at).format("DD/MM/YYYY:HH:mm:ss");
      user.updated_at = moment(user.updated_at).format("DD/MM/YYYY:HH:mm:ss");
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Obtener rol por ID
const getRoleById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('SELECT * FROM roles WHERE id = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    result[0].created_at = moment(result[0].created_at).format('DD/MM/YYYY:HH:mm:ss');
    result[0].updated_at = moment(result[0].updated_at).format('DD/MM/YYYY:HH:mm:ss');
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear un nuevo rol
const createRole = async (req, res) => {
  const { error } = roleSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name } = req.body;

  try {
    const [result] = await pool.query('INSERT INTO roles (name) VALUES (?)', [name]);
    res.status(201).json({
      message: 'Role created successfully',
      id: result.insertId,
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Duplicate entry for role name' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

//  Borrar rol
const deleteRoleById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM roles WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar rol 
const updateRoleById = async (req, res) => {
  const id = req.params.id;
  const { error } = roleSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name } = req.body;

  try {
    const [result] = await pool.query('UPDATE roles SET name = ? WHERE id = ?', [name, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json({ message: 'Role updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  deleteRoleById,
  updateRoleById,
};
