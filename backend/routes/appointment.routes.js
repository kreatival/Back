const express = require('express');
const appointmentController = require('../controllers/appointment.controller');
const router = express.Router();

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Retrieve a list of appointments
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: A list of appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 */
router.get('/', appointmentController.getAppointments);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get an appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single appointment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 */
router.get('/:id', appointmentController.getAppointmentById);

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', appointmentController.createAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Update an appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *       404:
 *         description: Appointment not found
 */
router.put('/:id', appointmentController.updateAppointmentById);

/**
 * @swagger
 * /appointments/{id}:
 *   patch:
 *     summary: Partially update an appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *       404:
 *         description: Appointment not found
 */
router.patch('/:id', appointmentController.patchAppointmentById);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Delete an appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 *       404:
 *         description: Appointment not found
 */
router.delete('/:id', appointmentController.deleteAppointmentById);

/**
 * @swagger
 * /appointments/dentist/{dentist_id}:
 *   get:
 *     summary: Retrieve all appointments for a specific dentist and state
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: dentist_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the dentist
 *       - in: query
 *         name: state
 *         required: false
 *         schema:
 *           type: string
 *         description: State of the appointments to filter
 *     responses:
 *       200:
 *         description: A list of appointments for the specified dentist
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid dentist ID
 *       404:
 *         description: No appointments found for the specified dentist
 */
 router.get('/dentist/:dentist_id', appointmentController.getAppointmentsByDentistIdAndState);

 /**
 * @swagger
 * /appointments/patient/{patient_id}:
 *   get:
 *     summary: Retrieve all appointments for a specific patient 
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: patient_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the patient *       
 *     responses:
 *       200:
 *         description: A list of appointments for the specified patient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid patient ID
 *       404:
 *         description: No appointments found for the specified patient
 */
 router.get("/patient/:patient_id", appointmentController.getAppointmentsByPatientId);

/**
 * @swagger
 * /appointments/patient/{patient_id}/confirmed:
 *   get:
 *     summary: Retrieve all confirmed appointments for a specific patient
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: patient_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the patient
 *     responses:
 *       200:
 *         description: A list of confirmed appointments for the specified patient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     description: The date of the appointment
 *                     example: "15-08-2024"
 *                   time:
 *                     type: string
 *                     description: The time of the appointment
 *                     example: "14:30"
 *                   reason:
 *                     type: string
 *                     description: The reason for the appointment
 *                     example: "Consultation"
 *       400:
 *         description: Invalid patient ID
 *       404:
 *         description: No confirmed appointments found for the specified patient
 */
router.get("/patient/:patient_id/confirmed", appointmentController.getConfirmedAppointmentsByPatientId);

router.get('/confirm/:id', (req, res) => appointmentController.updateAppointmentStatus(req, res, 'confirmed'));
router.get('/cancel/:id', (req, res) => appointmentController.updateAppointmentStatus(req, res, 'cancelled'));
router.get('/reschedule/:id', (req, res) => appointmentController.updateAppointmentStatus(req, res, 'rescheduled'));

module.exports = router;
