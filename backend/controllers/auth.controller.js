const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const { loginSchema, resetPasswordSchema, changePasswordSchema } = require('../validations/auth.validations');
const crypto = require('crypto');
const transporter = require('../config/email'); 

// Login
const login = async (req, res) => {
  // Validar los datos de entrada
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;

  try {
    // Consulta para obtener el usuario y el rol asociado
    const [userRows] = await pool.query(
      `
      SELECT u.*, r.name AS role
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.email = ?
    `,
      [email]
    );
      
    // Verifica si el usuario existe
    const user = userRows[0];
    if (!user) {
      return res.status(400).json({ error: "Correo electrónico o contraseña inválidos" });
    }

    // Compara la contraseña proporcionada con la contraseña almacenada
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Correo electrónico o contraseña inválidos" });
    }

    // Crea y devuelve un token para el usuario autenticado
    const token = jwt.sign(
      { user_id: user.id, first_name: user.first_name, last_name: user.last_name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: "Inicio de sesión exitoso",
      token: token,
    });
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Resetear contraseña
const resetPassword = async (req, res) => {
  const { email } = req.body;

  // Validar los datos de entrada
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    // Genera una nueva contraseña aleatoria
    const newPassword = generateRandomPassword(8); // Genera una contraseña de 8 caracteres
    
    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Obtener el usuario por correo electrónico
    const [user] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (user.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const userId = user[0].id;

    // Actualizar la contraseña en la base de datos
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);

    // Enviar la nueva contraseña por correo electrónico
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Tu nueva contraseña',
      text: `Tu nueva contraseña es: ${newPassword}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error al enviar el correo:", err);
        return res.status(500).json({ error: "Error al enviar el correo." });
      } else {
        console.log("Correo enviado:", info.response);
        return res.status(200).json({ message: "Contraseña restablecida y enviada por correo electrónico con éxito." });
      }
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al procesar la solicitud." });
  }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
  // Validar los datos de entrada
  const { error } = changePasswordSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const id = req.params.id;
  const { old_password, new_password, confirm_password } = req.body;

  if (new_password !== confirm_password) {
    return res.status(400).json({ error: "Las contraseñas no coinciden" });
  }

  try {
    // Verificar si el usuario existe en la base de datos
    const [results] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = results[0];
    // Verificar si la contraseña antigua es correcta
    const passwordMatch = await bcrypt.compare(old_password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Contraseña antigua incorrecta" });
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(new_password, 10);
    // Actualizar la contraseña en la base de datos
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, id]);

    res.json({ message: "Contraseña cambiada con éxito" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Genera una contraseña aleatoria de 8 caracteres
const generateRandomPassword = () => {
  return crypto.randomBytes(4).toString('hex'); // Genera una cadena de 8 caracteres hexadecimales
};


module.exports = { 
  login,
  resetPassword,
  changePassword 
};
