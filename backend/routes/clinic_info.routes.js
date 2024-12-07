const express = require('express');
const clinicController = require('../controllers/clinic_info.controller');
const router = express.Router();

/**
 * @swagger
 * /clinic-info:
 *   get:
 *     summary: Retrieve clinic information
 *     tags: [ClinicInfo]
 *     responses:
 *       200:
 *         description: A list of clinic information
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClinicInfo'
 */
router.get('/', clinicController.getClinicInfo);

/**
 * @swagger
 * /clinic-info/{id}:
 *   get:
 *     summary: Get clinic information by ID
 *     tags: [ClinicInfo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single clinic information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClinicInfo'
 *       404:
 *         description: Clinic not found
 */
router.get('/:id', clinicController.getClinicInfoById);

/**
 * @swagger
 * /clinic-info:
 *   post:
 *     summary: Create new clinic information
 *     tags: [ClinicInfo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClinicInfo'
 *     responses:
 *       201:
 *         description: Clinic information created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', clinicController.createClinicInfo);

/**
 * @swagger
 * /clinic-info/{id}:
 *   put:
 *     summary: Update clinic information by ID
 *     tags: [ClinicInfo]
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
 *             $ref: '#/components/schemas/ClinicInfo'
 *     responses:
 *       200:
 *         description: Clinic information updated successfully
 *       404:
 *         description: Clinic not found
 */
router.put('/:id', clinicController.updateClinicInfoById);

/**
 * @swagger
 * /clinic-info/{id}:
 *   patch:
 *     summary: Partially update clinic information by ID
 *     tags: [ClinicInfo]
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
 *             $ref: '#/components/schemas/ClinicInfo'
 *     responses:
 *       200:
 *         description: Clinic information partially updated successfully
 *       404:
 *         description: Clinic not found
 */
router.patch('/:id', clinicController.patchClinicInfoById);

/**
 * @swagger
 * /clinic-info/{id}:
 *   delete:
 *     summary: Delete clinic information by ID
 *     tags: [ClinicInfo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Clinic information deleted successfully
 *       404:
 *         description: Clinic not found
 */
router.delete('/:id', clinicController.deleteClinicInfoById);

module.exports = router;
