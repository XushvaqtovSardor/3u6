import { Router } from 'express';
import { delivery_stuffController } from '../controller/delivery_stuff.controller.js';
import { authGuard, roleGuard } from '../helpers/auth.js';
import { validate, deliveryStaffSchema } from '../validation/validation.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Delivery Staff
 *   description: Delivery staff management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DeliveryStaff:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         phone:
 *           type: string
 *         vehicle_number:
 *           type: number
 *         district_id:
 *           type: string
 *           format: objectId
 */

/**
 * @swagger
 * /delivery_stuff:
 *   get:
 *     summary: Get all delivery staff
 *     tags: [Delivery Staff]
 *     responses:
 *       200:
 *         description: List of all delivery staff
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DeliveryStaff'
 *   post:
 *     summary: Create new delivery staff
 *     tags: [Delivery Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryStaff'
 *     responses:
 *       201:
 *         description: Delivery staff created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /delivery_stuff/{id}:
 *   get:
 *     summary: Get delivery staff by ID
 *     tags: [Delivery Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delivery staff found
 *       404:
 *         description: Delivery staff not found
 *   patch:
 *     summary: Update delivery staff
 *     tags: [Delivery Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryStaff'
 *     responses:
 *       200:
 *         description: Delivery staff updated
 *       404:
 *         description: Delivery staff not found
 *   delete:
 *     summary: Delete delivery staff
 *     tags: [Delivery Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delivery staff deleted
 *       404:
 *         description: Delivery staff not found
 */

router
  .route('/')
  .get(authGuard, roleGuard('admin'), delivery_stuffController.find)
  .post(
    authGuard,
    roleGuard('admin'),
    validate(deliveryStaffSchema),
    delivery_stuffController.create
  );

router
  .route('/:id')
  .get(authGuard, roleGuard('admin'), delivery_stuffController.findOne)
  .patch(
    authGuard,
    roleGuard('admin'),
    validate(deliveryStaffSchema),
    delivery_stuffController.update
  )
  .delete(authGuard, roleGuard('admin'), delivery_stuffController.delete);

export { router as delivery_stuffRouter };
