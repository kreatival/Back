const express = require('express');
const remindersController = require('../controllers/reminder.controller');
const router = express.Router();

/**
 * @swagger
 * /reminders:
 *   get:
 *     summary: Retrieve a list of reminders
 *     tags: [Reminders]
 *     responses:
 *       200:
 *         description: A list of reminders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reminder'
 */
router.get('/', remindersController.getAllReminders);

/**
 * @swagger
 * /reminders/{id}:
 *   get:
 *     summary: Get a reminder by ID
 *     tags: [Reminders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single reminder
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reminder'
 *       404:
 *         description: Reminder not found
 */
router.get('/:id', remindersController.getReminderById);

/**
 * @swagger
 * /reminders:
 *   post:
 *     summary: Create a new reminder
 *     tags: [Reminders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reminder'
 *     responses:
 *       201:
 *         description: Reminder created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', remindersController.createReminder);

/**
 * @swagger
 * /reminders/{id}:
 *   put:
 *     summary: Update a reminder by ID
 *     tags: [Reminders]
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
 *             $ref: '#/components/schemas/Reminder'
 *     responses:
 *       200:
 *         description: Reminder updated successfully
 *       404:
 *         description: Reminder not found
 */
router.put('/:id', remindersController.updateReminder);

/**
 * @swagger
 * /reminders/{id}:
 *   delete:
 *     summary: Delete a reminder by ID
 *     tags: [Reminders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reminder deleted successfully
 *       404:
 *         description: Reminder not found
 */
router.delete('/:id', remindersController.deleteReminder);

module.exports = router;
