const express = require('express');
const router = express.Router();
const teethController = require('../controllers/teeth.controller');

/**
 * 
 * /teeth:
 *   get:
 *     summary: Retrieve a list of teeth
 *     tags: [Teeth]
 *     responses:
 *       200:
 *         description: A list of teeth
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tooth'
 */
router.get('/', teethController.getTeeth);

/**
 * 
 * /teeth/{id}:
 *   get:
 *     summary: Get a tooth by ID
 *     tags: [Teeth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single tooth
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tooth'
 *       404:
 *         description: Tooth not found
 */
router.get('/:id', teethController.getToothById);

/**
 * 
 * /teeth:
 *   post:
 *     summary: Create a new tooth record
 *     tags: [Teeth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tooth'
 *     responses:
 *       201:
 *         description: Tooth created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', teethController.createTooth);

/**
 * 
 * /teeth/{id}:
 *   put:
 *     summary: Update a tooth by ID
 *     tags: [Teeth]
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
 *             $ref: '#/components/schemas/Tooth'
 *     responses:
 *       200:
 *         description: Tooth updated successfully
 *       404:
 *         description: Tooth not found
 */
router.put('/:id', teethController.updateToothById);

/**
 * 
 * /teeth/{id}:
 *   patch:
 *     summary: Partially update a tooth by ID
 *     tags: [Teeth]
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
 *             $ref: '#/components/schemas/Tooth'
 *     responses:
 *       200:
 *         description: Tooth partially updated successfully
 *       404:
 *         description: Tooth not found
 */
router.patch('/:id', teethController.patchToothById);

/**
 * 
 * /teeth/{id}:
 *   delete:
 *     summary: Delete a tooth by ID
 *     tags: [Teeth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tooth deleted successfully
 *       404:
 *         description: Tooth not found
 */
router.delete('/:id', teethController.deleteToothById);

module.exports = router;
