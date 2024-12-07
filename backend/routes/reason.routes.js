const express = require('express');
const reasonController = require('../controllers/reason.controller');
const router = express.Router();

/**
 * @swagger
 * /reasons:
 *   get:
 *     summary: Retrieve a list of reasons
 *     tags: [Reasons]
 *     responses:
 *       200:
 *         description: A list of reasons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reason'
 */
router.get('/', reasonController.getReasons);

/**
 * @swagger
 * /reasons/{id}:
 *   get:
 *     summary: Get a reason by ID
 *     tags: [Reasons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single reason
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reason'
 *       404:
 *         description: Reason not found
 */
router.get('/:id', reasonController.getReasonById);

/**
 * @swagger
 * /reasons:
 *   post:
 *     summary: Create a new reason
 *     tags: [Reasons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reason'
 *     responses:
 *       201:
 *         description: Reason created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', reasonController.createReason);

/**
 * @swagger
 * /reasons/{id}:
 *   put:
 *     summary: Update a reason by ID
 *     tags: [Reasons]
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
 *             $ref: '#/components/schemas/Reason'
 *     responses:
 *       200:
 *         description: Reason updated successfully
 *       404:
 *         description: Reason not found
 */
router.put('/:id', reasonController.updateReasonById);

/**
 * @swagger
 * /reasons/{id}:
 *   delete:
 *     summary: Delete a reason by ID
 *     tags: [Reasons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reason deleted successfully
 *       404:
 *         description: Reason not found
 */
router.delete('/:id', reasonController.deleteReasonById);

module.exports = router;
