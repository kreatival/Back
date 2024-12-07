const cron = require("node-cron");
const { sendEmailReminder } = require("../controllers/email.controller");
const moment = require("moment");
const pool = require("../config/db");

async function sendReminders() {
    try {
        const now = new Date();
        const reminderTimes = [12, 24, 48, 72]; // Horas de anticipación

        for (const hours of reminderTimes) {
            // Calcula la fecha y hora del recordatorio en función de la anticipación
            const reminderTime = new Date(now.getTime() + hours * 60 * 60 * 1000);
            const reminderDateString = moment(reminderTime).format("YYYY-MM-DD"); // Fecha en formato YYYY-MM-DD
            const reminderTimeString = moment(reminderTime).format("HH"); // Hora en formato HH:MM

            // Consulta para obtener turnos que coincidan con la hora de recordatorio
            const query = `
                SELECT a.id AS turno_id, a.patient_id, a.date, a.time, rc.id AS reminder_config_id, p.email, p.phone_number, p.first_name AS patient_name, u.first_name  AS dentist_name 
                FROM appointments a
                JOIN reminder_configurations rc ON a.id = rc.appointment_id
                JOIN patients p ON a.patient_id = p.id
                JOIN users u ON a.dentist_id = u.id 
                WHERE rc.is_active = 1
                AND rc.anticipation_time = ?
                AND a.date = ?
            `;
            const params = [hours, reminderDateString, `${reminderTimeString}%`];
            const [appointments] = await pool.query(query, params);

            for (const appointment of appointments) {
                // Verifica si ya se ha enviado un recordatorio para esta cita
                const [reminderRecord] = await pool.query(`
                    SELECT id FROM reminders WHERE appointment_id = ?
                `, [appointment.turno_id]);

                if (reminderRecord.length === 0) {
                    // Envía el recordatorio por correo electrónico
                    await sendEmailReminder(appointment);

                    // Registra el recordatorio enviado
                    await pool.query(`
                        INSERT INTO reminders (appointment_id) VALUES (?)
                    `, [appointment.turno_id]);
                }
            }
        }
    } catch (error) {
        console.error("Error sending reminders:", error);
    }
}

cron.schedule("*/30 * * * * *", () => {
    console.log("Running reminder job...");
    sendReminders();
});
