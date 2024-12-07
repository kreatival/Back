const express = require('express');
const router = express.Router();
const { sendMessage, verifyWebhook, receiveMessage } = require('../controllers/whatsapp.controller');

// Ruta para enviar un mensaje de recordatorio por WhatsApp
router.post('/send', sendMessage);

// Ruta para la verificación del webhook de WhatsApp
router.get('/webhook', verifyWebhook);

// Ruta para recibir mensajes de respuesta desde WhatsApp
router.post('/webhook', receiveMessage);

module.exports = router;
