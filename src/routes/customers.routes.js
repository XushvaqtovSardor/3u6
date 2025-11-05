import { Router } from "express";
import { customersController } from "../controller/customers.controller.js";
import { authGuard, selfGuard, roleGuard } from "../helpers/auth.js";
import { validate, customerSchema } from "../validation/validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         phone:
 *           type: string
 */

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: List of all customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *   post:
 *     summary: Create new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer found
 *       404:
 *         description: Customer not found
 *   patch:
 *     summary: Update customer
 *     tags: [Customers]
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
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: Customer updated
 *       404:
 *         description: Customer not found
 *   delete:
 *     summary: Delete customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer deleted
 *       404:
 *         description: Customer not found
 */

router
  .route("/")
  .get(authGuard, roleGuard("admin"), customersController.find)
  .post(validate(customerSchema), customersController.create);

router
  .route("/:id")
  .get(authGuard, selfGuard(), customersController.findOne)
  .patch(
    authGuard,
    selfGuard(),
    validate(customerSchema),
    customersController.update,
  )
  .delete(authGuard, roleGuard("admin"), customersController.delete);

export { router as customersRouter };
