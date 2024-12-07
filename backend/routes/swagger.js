const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swaggerOptions'); // Importa las opciones de Swagger

const router = express.Router();

// Ruta para servir la interfaz de usuario de Swagger
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec));

module.exports = router;
