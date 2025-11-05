import { Router } from "express";
import { paymentsController } from "../controller/payments.controller.js";
import { authGuard, roleGuard } from "../helpers/auth.js";
import { validate, paymentSchema } from "../validation/validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - amount
 *       properties:
 *         order_id:
 *           type: string
 *           format: objectId
 *         payment_date:
 *           type: string
 *           format: date-time
 *         amount:
 *           type: number
 *         method:
 *           type: string
 *           enum: [pending, paid]
 */

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of all payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *   post:
 *     summary: Create new payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment found
 *       404:
 *         description: Payment not found
 *   patch:
 *     summary: Update payment
 *     tags: [Payments]
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
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       200:
 *         description: Payment updated
 *       404:
 *         description: Payment not found
 *   delete:
 *     summary: Delete payment
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment deleted
 *       404:
 *         description: Payment not found
 */

router
  .route("/")
  .get(authGuard, paymentsController.find)
  .post(authGuard, validate(paymentSchema), paymentsController.create);

router
  .route("/:id")
  .get(authGuard, paymentsController.findOne)
  .patch(
    authGuard,
    roleGuard("admin", "customer"),
    validate(paymentSchema),
    paymentsController.update,
  )
  .delete(authGuard, roleGuard("admin", "customer"), paymentsController.delete);

export { router as paymentsRouter };
