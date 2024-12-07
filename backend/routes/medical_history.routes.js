const express = require('express');
const medicalHistoryController = require('../controllers/medical_history.controller');
const router = express.Router();

/**
 * 
 * /medical-history:
 *   get:
 *     summary: Retrieve all medical histories
 *     tags: [MedicalHistory]
 *     responses:
 *       200:
 *         description: A list of medical histories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MedicalHistory'
 */
router.get('/', medicalHistoryController.getMedicalHistories);

/**
 * 
 * /medical-history/{id}:
 *   get:
 *     summary: Get a medical history by ID
 *     tags: [MedicalHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single medical history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MedicalHistory'
 *       404:
 *         description: Medical history not found
 */
router.get('/:id', medicalHistoryController.getMedicalHistoryById);

/**
 * 
 * /medical-history:
 *   post:
 *     summary: Create a new medical history
 *     tags: [MedicalHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicalHistory'
 *     responses:
 *       201:
 *         description: Medical history created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', medicalHistoryController.createMedicalHistory);

/**
 * 
 * /medical-history/{id}:
 *   put:
 *     summary: Update a medical history by ID
 *     tags: [MedicalHistory]
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
 *             $ref: '#/components/schemas/MedicalHistory'
 *     responses:
 *       200:
 *         description: Medical history updated successfully
 *       404:
 *         description: Medical history not found
 */
router.put('/:id', medicalHistoryController.updateMedicalHistoryById);

/**
 * 
 * /medical-history/{id}:
 *   delete:
 *     summary: Delete a medical history by ID
 *     tags: [MedicalHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Medical history deleted successfully
 *       404:
 *         description: Medical history not found
 */
router.delete('/:id', medicalHistoryController.deleteMedicalHistoryById);

module.exports = router;
