const bcrypt = require("bcrypt");
const pool = require("../config/db");
const moment = require("moment");
const {
  userSchema,
  userPatchSchema,
} = require("../validations/user.validations");
const { singleImageUpload } = require("../config/multer");

// Obtener todos los usuarios o filtrar por tipo de usuario
const getUsers = async (req, res) => {
  const roleId = req.query.role_id;

  try {
    let query = `
      SELECT u.*
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN clinic_info c ON u.clinic_id = c.id
    `;

    const values = [];
    if (roleId) {
      query += " WHERE u.role_id = ?";
      values.push(roleId);
    }

    const [results] = await pool.query(query, values);

    results.forEach((user) => {
      user.created_at = moment(user.created_at).format("DD/MM/YYYY HH:mm:ss");
      user.updated_at = moment(user.updated_at).format("DD/MM/YYYY HH:mm:ss");
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  const id = req.params.id;
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing user ID" });
  }

  try {
    const [result] = await pool.query(
      `
      SELECT u.*
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN clinic_info c ON u.clinic_id = c.id
      WHERE u.id = ?
      `,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    result[0].created_at = moment(result[0].created_at).format(
      "DD/MM/YYYY HH:mm:ss"
    );
    result[0].updated_at = moment(result[0].updated_at).format(
      "DD/MM/YYYY HH:mm:ss"
    );

    // Eliminar los campos clinic_id y role_id de la respuesta
    delete result[0].role_id;

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Borrar un usuario por ID
const deleteUserById = async (req, res) => {
  const id = req.params.id;
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing user ID" });
  }

  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Crear un nuevo usuario
const createUser = async (req, res) => {
  singleImageUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const {
      first_name,
      last_name,
      dni,
      email,
      phone_number,
      password,
      role_id,
      active,
      clinic_id,
    } = req.body;

    // Convert boolean 'active' to integer
    const activeInt = active === "true" || active === true ? 1 : 0;

    let image_path = null;
    if (req.file) {
      image_path = `${process.env.SERVER_URL}/${req.file.path}`;
    }

    try {
      // Validar si clinic_id existe
      const [clinicResult] = await pool.query(
        "SELECT id FROM clinic_info WHERE id = ?",
        [clinic_id]
      );
      if (clinicResult.length === 0) {
        return res.status(400).json({ error: "Clinic ID does not exist" });
      }

      // Validar si role_id existe
      const [roleResult] = await pool.query(
        "SELECT id FROM roles WHERE id = ?",
        [role_id]
      );
      if (roleResult.length === 0) {
        return res.status(400).json({ error: "Role ID does not exist" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const sqlUser = `
        INSERT INTO users (first_name, last_name, dni, email, phone_number, password, role_id, active, clinic_id, image_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const valuesUser = [
        first_name,
        last_name,        
        dni,
        email,
        phone_number,
        hashedPassword,
        role_id,
        activeInt,
        clinic_id,
        image_path,
      ];

      const [resultUser] = await pool.query(sqlUser, valuesUser);

      const [newUser] = await pool.query("SELECT * FROM users WHERE id = ?", [
        resultUser.insertId,
      ]);

      newUser[0].created_at = moment(newUser[0].created_at).format(
        "DD/MM/YYYY HH:mm:ss"
      );
      newUser[0].updated_at = moment(newUser[0].updated_at).format(
        "DD/MM/YYYY HH:mm:ss"
      );

      res.json({
        message: "User created successfully",
        user: newUser[0],
      });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(409).json({ error: "Duplicate entry for email or dni" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  });
};

// Actualizar un usuario por ID
const updateUserById = async (req, res) => {
  singleImageUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const id = req.params.id;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid or missing user ID" });
    }

    const {
      first_name,
      last_name,
      email,
      role_id,
      dni,
      active,
      phone_number,
      clinic_id,
    } = req.body;

    // Convert boolean 'active' to integer
    const activeInt = active === "true" || active === true ? 1 : 0;

    let image_path = null;
    if (req.file) {
      image_path = `${process.env.SERVER_URL}/${req.file.path}`;
    }

    // Validar si role_id existe (si se proporciona)
    if (role_id) {
      const [roleResult] = await pool.query(
        "SELECT id FROM roles WHERE id = ?",
        [role_id]
      );
      if (roleResult.length === 0) {
        return res.status(400).json({ error: "Role ID does not exist" });
      }
    }

    // Validar si clinic_id existe (si se proporciona)
    if (clinic_id) {
      const [clinicResult] = await pool.query(
        "SELECT id FROM clinic_info WHERE id = ?",
        [clinic_id]
      );
      if (clinicResult.length === 0) {
        return res.status(400).json({ error: "Clinic ID does not exist" });
      }
    }

    const sql = `
      UPDATE users 
      SET first_name = ?, last_name = ?, email = ?, role_id = ?, dni = ?, active = ?, phone_number = ?, clinic_id = ?, image_path = ?
      WHERE id = ?
    `;
    const values = [
      first_name,
      last_name,
      checkedBirthDate,
      email,
      role_id,
      dni,
      activeInt,
      phone_number,
      clinic_id,
      image_path,
      id,
    ];

    try {
      const [result] = await pool.query(sql, values);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

// Actualizar parcialmente un usuario por ID
const patchUserById = async (req, res) => {
  singleImageUpload(req, res, async (err) => {
    const { error } = userPatchSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const id = req.params.id;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid or missing user ID" });
    }

    const {
      first_name,
      last_name,
      email,
      role_id,
      dni,
      active,
      phone_number,
      clinic_id,
      image_path,
    } = req.body;
    
    // Validar si role_id existe (si se proporciona)
    if (role_id) {
      const [roleResult] = await pool.query(
        "SELECT id FROM roles WHERE id = ?",
        [role_id]
      );
      if (roleResult.length === 0) {
        return res.status(400).json({ error: "Role ID does not exist" });
      }
    }

    // Validar si clinic_id existe (si se proporciona)
    if (clinic_id) {
      const [clinicResult] = await pool.query(
        "SELECT id FROM clinic_info WHERE id = ?",
        [clinic_id]
      );
      if (clinicResult.length === 0) {
        return res.status(400).json({ error: "Clinic ID does not exist" });
      }
    }

    // Construir la consulta de actualización
    let sql = "UPDATE users SET ";
    const values = [];

    if (first_name) {
      sql += "first_name = ?, ";
      values.push(first_name);
    }
    if (last_name) {
      sql += "last_name = ?, ";
      values.push(last_name);
    }    
    if (email) {
      sql += "email = ?, ";
      values.push(email);
    }
    if (role_id) {
      sql += "role_id = ?, ";
      values.push(role_id);
    }
    if (dni) {
      sql += "dni = ?, ";
      values.push(dni);
    }
    if (typeof active !== "undefined") {
      // Convertir boolean 'active' a entero
      const activeInt = active === "true" || active === true ? 1 : 0;
      sql += "active = ?, ";
      values.push(activeInt);
    }
    if (phone_number) {
      sql += "phone_number = ?, ";
      values.push(phone_number);
    }
    if (clinic_id) {
      sql += "clinic_id = ?, ";
      values.push(clinic_id);
    }
    if (image_path !== undefined) {
      sql += "image_path = ?, ";
      values.push(image_path);
    }

    // Remover la última coma y espacio
    sql = sql.slice(0, -2);
    sql += " WHERE id = ?";
    values.push(id);
    try {
      const [result] = await pool.query(sql, values);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

module.exports = {
  getUsers,
  getUserById,
  deleteUserById,
  createUser,
  updateUserById,
  patchUserById,
};
