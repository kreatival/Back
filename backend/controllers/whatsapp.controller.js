const axios = require("axios");
const pool = require("../config/db");

const token = process.env.WHATSAPP_API_TOKEN;
const phoneNumberId = process.env.WHATSAPP_BUSINESS_PHONE_NUMBER;
const verifyToken = process.env.VERIFY_TOKEN;
const apiUrl = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

const messageTemplates = {
  1: "Tu turno ha sido confirmado. ¡Te esperamos!",
  2: "Tu turno ha sido cancelado. Si cambias de opinión, no dudes en contactarnos.",
  3: "Hemos recibido tu solicitud de reprogramación. Nos pondremos en contacto para coordinar una nueva fecha.",
  default: (msgBody) => `Tu respuesta '${msgBody}' ha sido recibida.`,
};

const updateAppointmentStates = {
  confirmed: "confirmed",
  cancelled: "cancelled",
  rescheduled: "rescheduled",
};

// Enviar mensaje Whatsapp
const sendMessage = async (req, res) => {
  const {
    patient_name,
    phoneNumber,
    clinicName,
    appointmentDate,
    appointmentTime,
    dentistName,
    appointmentId,
  } = req.body;

  const data = {
    messaging_product: "whatsapp",
    to: phoneNumber,
    type: "template",
    template: {
      name: "recordatorio_turno",
      language: { code: "es_AR" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: patient_name },
            { type: "text", text: clinicName },
            { type: "text", text: appointmentDate },
            { type: "text", text: appointmentTime },
            { type: "text", text: dentistName },
          ],
        },
      ],
    },
  };

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const waId = response.data.contacts[0].wa_id;
    console.log("Mensaje enviado con éxito:", response.data);
    console.log("WhatsApp ID:", waId);

    await recordMessageSent(appointmentId, waId);

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to send message" });
  }
};

const recordMessageSent = async (appointmentId, waId) => {
  const query = "INSERT INTO reminders (appointment_id, wa_id) VALUES (?, ?)";
  await pool.execute(query, [appointmentId, waId]);
};

const receiveMessage = async (req, res) => {
  const body = req.body;

  if (body.object === "whatsapp_business_account") {
    try {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          const { messages } = change.value;

          if (messages) {
            for (const message of messages) {
              if (message.type === "text") {
                const { from, text: { body: msgBody } } = message;
                console.log(`Received message from ${from}: ${msgBody}`);

                const response = getResponseForMessage(msgBody);
                if (!response) {
                  console.log(`Unrecognized response: ${msgBody}`);
                  continue;
                }

                const patient = await getPatientIdByWaId(from);
                if (!patient) {
                  console.log(`No patient found with phone number ${from}`);
                  continue;
                }

                const reminder = await getLastReminderForPatient(patient);
                if (!reminder) {
                  console.log(`No reminder found for patient ${patient}`);
                  continue;
                }

                await updateReminderResponse(reminder.id, response);
                await updateAppointmentStatus(reminder.appointment_id, response);

                const responseMessage = messageTemplates[msgBody] || messageTemplates.default(msgBody);
                await sendWhatsAppMessage(from, responseMessage, message.id);
              }
            }
          }
        }
      }

      res.sendStatus(200);
    } catch (error) {
      console.error("Error processing messages:", error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};

const sendWhatsAppMessage = async (to, body, messageId) => {
  try {
    await axios.post(apiUrl, {
      messaging_product: "whatsapp",
      to,
      text: { body },
      context: { message_id: messageId },
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error sending WhatsApp message:", error.message);
  }
};

const getResponseForMessage = (msgBody) => {
  switch (msgBody) {
    case "1": return "confirmed";
    case "2": return "cancelled";
    case "3": return "rescheduled";
    default: return null;
  }
};

const updateAppointmentStatus = async (appointmentId, response) => {
  const state = updateAppointmentStates[response];
  if (!state) {
    console.log(`Unrecognized response: ${response}`);
    return;
  }

  const query = "UPDATE appointments SET state = ? WHERE id = ?";
  await pool.execute(query, [state, appointmentId]);
};

const getPatientIdByWaId = async (waId) => {
  if (!waId) {
    console.error("WhatsApp ID is undefined or null");
    return null;
  }

  const query = `
    SELECT a.patient_id
    FROM reminders r
    INNER JOIN appointments a ON r.appointment_id = a.id
    WHERE r.wa_id = ?
  `;
  const [rows] = await pool.execute(query, [waId]);

  return rows.length > 0 ? rows[0].patient_id : null;
};

const getLastReminderForPatient = async (patientId) => {
  const query = `
    SELECT *
    FROM reminders
    WHERE appointment_id IN (
      SELECT id
      FROM appointments
      WHERE patient_id = ?
    )
    AND status = 'sent'
    AND response IS NULL
    ORDER BY sent_at DESC
    LIMIT 1
  `;

  const [rows] = await pool.execute(query, [patientId]);
  return rows[0];
};

const updateReminderResponse = async (reminderId, response) => {
  const query = `
    UPDATE reminders
    SET response = ?, response_received_at = NOW()
    WHERE id = ?
  `;
  await pool.execute(query, [response, reminderId]);
};

const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === verifyToken) {
      console.log("Webhook verified");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
};

module.exports = {
  sendMessage,
  verifyWebhook,
  receiveMessage,
};
