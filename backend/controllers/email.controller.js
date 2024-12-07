const nodemailer = require('nodemailer');
const pool = require('../config/db');
const transporter = require('../config/email'); 
const moment = require("moment");

async function sendEmailReminder(appointment) { 
    const formattedDate = moment(appointment.date).format('DD/MM/YYYY');
    const formattedTime = moment(appointment.time, 'HH:mm:ss').format('HH:mm');
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: appointment.email,
        subject: 'Recordatorio de Cita',
        html: `
            <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                    <h2 style="color: #2c3e50;">Recordatorio de Cita</h2>
                    <p>Hola ${appointment.patient_name},</p>
                    <p>Le recordamos que tiene una turno el <strong>${formattedDate}</strong> a las <strong>${formattedTime}</strong> con el Dr. <strong>${appointment.dentist_name}</strong>.</p>
                    <p>Por favor seleccione una de las siguientes opciones:</p>
                    <div style="margin: 20px 0;">
                        <a href="${process.env.SERVER_URL}/api/appointments/confirm/${appointment.turno_id}" 
                           style="display: inline-block; padding: 10px 20px; margin: 0 5px; text-decoration: none; color: #fff; background-color: #27ae60; border-radius: 5px; font-weight: bold;">Confirmar</a>
                        <a href="${process.env.SERVER_URL}/api/appointments/cancel/${appointment.turno_id}" 
                           style="display: inline-block; padding: 10px 20px; margin: 0 5px; text-decoration: none; color: #fff; background-color: #e74c3c; border-radius: 5px; font-weight: bold;">Cancelar</a>
                        <a href="${process.env.SERVER_URL}/api/appointments/reschedule/${appointment.turno_id}" 
                           style="display: inline-block; padding: 10px 20px; margin: 0 5px; text-decoration: none; color: #fff; background-color: #3498db; border-radius: 5px; font-weight: bold;">Reprogramar</a>
                    </div>
                    <p>Si tiene alguna pregunta, no dude en contactarnos.</p>
                    <p>Gracias,</p>
                    <p>El equipo de DentPlanner</p>
                </div>
            </body>
            </html>
        `
    };
    await transporter.sendMail(mailOptions);
}


// Función para enviar correos electrónicos basados en la acción
async function sendEmailResponse(appointmentId, action) {
    try {
      const [appointment] = await pool.query(`
        SELECT p.email AS email, p.first_name AS patient_name, u.first_name AS dentist_name 
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users u ON a.dentist_id = u.id 
        WHERE a.id = ?
      `, [appointmentId]);
      let subject;
      let text;
        
      const { email, patient_name, dentist_name } = appointment[0];

      // Determinar el asunto y el texto del correo basado en la acción
      switch (action) {
        case 'confirm':
          subject = 'Confirmación de Turno';
          text = `Hola ${patient_name}, tu turno con el Dr. ${dentist_name} ha sido confirmado.`;
          break;
        case 'cancel':
          subject = 'Cancelación de Turno';
          text = `Hola ${patient_name}, tu turno con el Dr. ${dentist_name} ha sido cancelado.`;
          break;
        case 'reschedule':
          subject = 'Reprogramación de Turno';
          text = `Hola ${patient_name}, hemos recibido tu solicitud de reprogramación de tu turno con el Dr. ${dentist_name}. Nos pondremos en contacto para coordinar una nueva fecha.`;
          break;
        default:
          throw new Error('Acción no válida');
      }
      // Configurar y enviar el correo electrónico
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: text,
      };
  
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  module.exports = {
    sendEmailResponse,
    sendEmailReminder
  }