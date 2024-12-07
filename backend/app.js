// Aplicacion principal
require('dotenv').config();
require('./cron-jobs/email_reminderJob');

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerOptions'); 
const path = require('path');

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const whatsappRoutes = require("./routes/whatsapp.routes");
const roleRoutes = require("./routes/role.routes");
const patientRoutes = require("./routes/patient.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const medicalHistoryRoutes = require("./routes/medical_history.routes");
const odontogramRoutes = require("./routes/odontogram.routes");
const teethRoutes = require('./routes/teeth.routes');
const reasonRoutes = require('./routes/reason.routes');
const clinic_infoRoutes = require('./routes/clinic_info.routes');
const supportRoutes = require('./routes/support.routes');
const reminderRoutes = require('./routes/reminder.routes');
const reminderConfigurationsRoutes = require('./routes/reminder_configurations.routes');

// Crear una instancia de la aplicación Express
const app = express();

// Configuración
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-history", medicalHistoryRoutes);
app.use("/api/odontograms", odontogramRoutes);
app.use("/api/teeth", teethRoutes);
app.use("/api/reasons", reasonRoutes);
app.use("/api/clinic-info", clinic_infoRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/reminder-configurations', reminderConfigurationsRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Definir el puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
