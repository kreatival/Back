const express = require('express');
const reminderConfigController = require('../controllers/reminder_configurations.controller');
const router = express.Router();

/**
 * @swagger
 * /reminder-configurations:
 *   get:
 *     summary: Retrieve all reminder configurations
 *     tags: [ReminderConfigurations]
 *     responses:
 *       200:
 *         description: A list of reminder configurations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReminderConfiguration'
 */
router.get('/', reminderConfigController.getReminderConfigurations);

/**
 * @swagger
 * /reminder-configurations/{id}:
 *   get:
 *     summary: Get a reminder configuration by ID
 *     tags: [ReminderConfigurations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single reminder configuration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReminderConfiguration'
 *       404:
 *         description: Reminder configuration not found
 */
router.get('/:id', reminderConfigController.getReminderConfigurationById);

/**
 * @swagger
 * /reminder-configurations:
 *   post:
 *     summary: Create a new reminder configuration
 *     tags: [ReminderConfigurations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReminderConfiguration'
 *     responses:
 *       201:
 *         description: Reminder configuration created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', reminderConfigController.createReminderConfiguration);

/**
 * @swagger
 * /reminder-configurations/{id}:
 *   put:
 *     summary: Update a reminder configuration by ID
 *     tags: [ReminderConfigurations]
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
 *             $ref: '#/components/schemas/ReminderConfiguration'
 *     responses:
 *       200:
 *         description: Reminder configuration updated successfully
 *       404:
 *         description: Reminder configuration not found
 */
router.put('/:id', reminderConfigController.updateReminderConfigurationById);

/**
 * @swagger
 * /reminder-configurations/{id}:
 *   delete:
 *     summary: Delete a reminder configuration by ID
 *     tags: [ReminderConfigurations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reminder configuration deleted successfully
 *       404:
 *         description: Reminder configuration not found
 */
router.delete('/:id', reminderConfigController.deleteReminderConfigurationById);

module.exports = router;
