import { Router } from 'express';
import { ordersController } from '../controller/orders.controller.js';
import { authGuard, roleGuard } from '../helpers/auth.js';
import { validate, orderSchema } from '../validation/validation.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - customer_id
 *         - status
 *       properties:
 *         customer_id:
 *           type: string
 *           format: objectId
 *         Delivery_staff_id:
 *           type: string
 *           format: objectId
 *         order_date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [pending, accepted, delivering, recieved]
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *   post:
 *     summary: Create new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 *   patch:
 *     summary: Update order
 *     tags: [Orders]
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
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order updated
 *       404:
 *         description: Order not found
 *   delete:
 *     summary: Delete order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted
 *       404:
 *         description: Order not found
 */

router
  .route('/')
  .get(authGuard, ordersController.find)
  .post(authGuard, validate(orderSchema), ordersController.create);

router
  .route('/:id')
  .get(authGuard, ordersController.findOne)
  .patch(
    authGuard,
    roleGuard('admin', 'delivery_staff'),
    validate(orderSchema),
    ordersController.update
  )
  .delete(authGuard, roleGuard('admin'), ordersController.delete);

export { router as ordersRouter };
