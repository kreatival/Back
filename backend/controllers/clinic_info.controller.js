const pool = require('../config/db');
const moment = require('moment');
const clinicInfoSchema = require('../validations/clinic_info.validations'); // Ajusta la ruta según sea necesario

// Obtener toda la información de la clínica
const getClinicInfo = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM clinic_info');

    // Formatear las horas de apertura y cierre
    results.forEach(clinic => {
      clinic.opening_hours = moment(clinic.opening_hours, 'HH:mm:ss').format('HH:mm');
      clinic.closing_hours = moment(clinic.closing_hours, 'HH:mm:ss').format('HH:mm');
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener información de la clínica
const getClinicInfoById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('SELECT * FROM clinic_info WHERE id = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    result[0].opening_hours = moment(result[0].opening_hours, 'HH:mm:ss').format('HH:mm');
    result[0].closing_hours = moment(result[0].closing_hours, 'HH:mm:ss').format('HH:mm');

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nueva información de la clínica
const createClinicInfo = async (req, res) => {
  const { error } = clinicInfoSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, phone_number, address, email, opening_hours, closing_hours } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO clinic_info (name, phone_number, address, email, opening_hours, closing_hours)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, phone_number, address, email, opening_hours, closing_hours]
    );
    res.status(201).json({
      message: 'Clinic information created successfully',
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar información de la clínica
const updateClinicInfoById = async (req, res) => {
  const id = req.params.id;
  const { error } = clinicInfoSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, phone_number, address, email, opening_hours, closing_hours } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE clinic_info 
       SET name = ?, phone_number = ?, address = ?, email = ?, opening_hours = ?, closing_hours = ?
       WHERE id = ?`,
      [name, phone_number, address, email, opening_hours, closing_hours, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    res.json({ message: 'Clinic information updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar información de la clínica
const deleteClinicInfoById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM clinic_info WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    res.json({ message: 'Clinic information deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar parcialmente información de la clínica
const patchClinicInfoById = async (req, res) => {
  const id = req.params.id;
  const { name, phone_number, address, email, opening_hours, closing_hours } = req.body;

  // Construir la consulta SQL dinámicamente
  let sql = "UPDATE clinic_info SET ";
  const values = [];

  if (name) {
    sql += "name = ?, ";
    values.push(name);
  }
  if (phone_number) {
    sql += "phone_number = ?, ";
    values.push(phone_number);
  }
  if (address) {
    sql += "address = ?, ";
    values.push(address);
  }
  if (email) {
    sql += "email = ?, ";
    values.push(email);
  }
  if (opening_hours) {
    sql += "opening_hours = ?, ";
    values.push(opening_hours);
  }
  if (closing_hours) {
    sql += "closing_hours = ?, ";
    values.push(closing_hours);
  }

  // Eliminar la última coma y espacio del SQL
  sql = sql.slice(0, -2);
  sql += " WHERE id = ?";
  values.push(id);

  try {
    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    res.json({ message: 'Clinic information partially updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getClinicInfo,
  getClinicInfoById,
  createClinicInfo,
  updateClinicInfoById,
  deleteClinicInfoById,
  patchClinicInfoById,
};
