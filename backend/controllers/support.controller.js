const { multipleImagesUpload } = require('../config/multer'); 
const pool = require('../config/db');
const transporter = require('../config/email');
const { supportRequestSchema } = require('../validations/support.validations');

//  Crear una nueva solicitud de soporte
const createSupportRequest = async (req, res) => {
  multipleImagesUpload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Validar los datos de entrada
    const { error } = supportRequestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { first_name, last_name, phone_number, email, issue_detail } = req.body;
    let imagePaths = []; // Definir la variable aquí

    try {
      const [result] = await pool.query(
        'INSERT INTO support_requests (first_name, last_name, phone_number, email, issue_detail) VALUES (?, ?, ?, ?, ?)',
        [first_name, last_name, phone_number, email, issue_detail]
      );

      const supportRequestId = result.insertId;

      if (req.files && req.files.length > 0) {
        imagePaths = req.files.map(file => {
          // Construir la URL completa de cada imagen
          const fullUrl = `${process.env.SERVER_URL}/${file.path}`;
          return fullUrl;
        });
        for (const imagePath of imagePaths) {
          console.log(imagePath);
          await pool.query(
            'INSERT INTO support_images (support_request_id, image_path) VALUES (?, ?)',
            [supportRequestId, imagePath]
          );
        }
      }
      
      // Enviar correo al soporte
      const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: 'Nueva solicitud de soporte',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="text-align: center; color: #333;">Nueva solicitud de soporte</h2>
            <p><strong>Nombre:</strong> ${first_name}</p>
            <p><strong>Apellido:</strong> ${last_name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Detalle del problema:</strong> ${issue_detail}</p>
            ${imagePaths.length > 0 ? '<p><strong>Imágenes adjuntas:</strong></p>' + imagePaths.map(imagePath => `<p>${imagePath}</p>`).join('') : ''}
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
      res.status(201).json({ message: 'Support request created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

//  Obtener todas las solicitudes de reportes
const getSupportRequests = async (req, res) => {
  try {
    const [supportRequests] = await pool.query('SELECT * FROM support_requests');
    res.json(supportRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Obtener solicitud de soporte por ID
const getSupportRequestById = async (req, res) => {
  const { id } = req.params;

  try {
    const [supportRequestRows] = await pool.query(
      'SELECT * FROM support_requests WHERE id = ?',
      [id]
    );

    if (supportRequestRows.length === 0) {
      return res.status(404).json({ error: 'Support request not found' });
    }

    const supportRequest = supportRequestRows[0];

    const [imageRows] = await pool.query(
      'SELECT image_path FROM support_images WHERE support_request_id = ?',
      [id]
    );

    const images = imageRows.map(row => row.image_path);

    res.status(200).json({
      id: supportRequest.id,
      first_name: supportRequest.first_name,
      last_name: supportRequest.last_name,
      email: supportRequest.email,
      issue_detail: supportRequest.issue_detail,
      images: images
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSupportRequest,
  getSupportRequests,
  getSupportRequestById
};
