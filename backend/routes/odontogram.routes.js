const express = require('express');
const router = express.Router();
const odontogramsController = require('../controllers/odontogram.controller');

/**
 * 
 * /odontograms:
 *   get:
 *     summary: Retrieve a list of odontograms
 *     tags: [Odontograms]
 *     responses:
 *       200:
 *         description: A list of odontograms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Odontogram'
 */
router.get('/', odontogramsController.getOdontograms);

/**
 * 
 * /odontograms/{id}:
 *   get:
 *     summary: Get an odontogram by ID
 *     tags: [Odontograms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single odontogram
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Odontogram'
 *       404:
 *         description: Odontogram not found
 */
router.get('/:id', odontogramsController.getOdontogramById);

/**
 * 
 * /odontograms:
 *   post:
 *     summary: Create a new odontogram
 *     tags: [Odontograms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Odontogram'
 *     responses:
 *       201:
 *         description: Odontogram created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', odontogramsController.createOdontogram);

/**
 * 
 * /odontograms/{id}:
 *   put:
 *     summary: Update an odontogram by ID
 *     tags: [Odontograms]
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
 *             $ref: '#/components/schemas/Odontogram'
 *     responses:
 *       200:
 *         description: Odontogram updated successfully
 *       404:
 *         description: Odontogram not found
 */
router.put('/:id', odontogramsController.updateOdontogramById);

/**
 * 
 * /odontograms/{id}:
 *   delete:
 *     summary: Delete an odontogram by ID
 *     tags: [Odontograms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Odontogram deleted successfully
 *       404:
 *         description: Odontogram not found
 */
router.delete('/:id', odontogramsController.deleteOdontogramById);

module.exports = router;
