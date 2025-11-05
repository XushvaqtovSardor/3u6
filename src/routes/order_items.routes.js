import { Router } from "express";
import { order_itemsController } from "../controller/order_items.controller.js";
import { authGuard, roleGuard } from "../helpers/auth.js";
import { validate, orderItemSchema } from "../validation/validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Order Items
 *   description: Order items management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         order_id:
 *           type: string
 *           format: objectId
 *         product_id:
 *           type: string
 *           format: objectId
 *         quantity:
 *           type: number
 *         total_price:
 *           type: number
 */

/**
 * @swagger
 * /order_items:
 *   get:
 *     summary: Get all order items
 *     tags: [Order Items]
 *     responses:
 *       200:
 *         description: List of all order items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItem'
 *   post:
 *     summary: Create new order item
 *     tags: [Order Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       201:
 *         description: Order item created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /order_items/{id}:
 *   get:
 *     summary: Get order item by ID
 *     tags: [Order Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order item found
 *       404:
 *         description: Order item not found
 *   patch:
 *     summary: Update order item
 *     tags: [Order Items]
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
 *             $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       200:
 *         description: Order item updated
 *       404:
 *         description: Order item not found
 *   delete:
 *     summary: Delete order item
 *     tags: [Order Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order item deleted
 *       404:
 *         description: Order item not found
 */

router
  .route("/")
  .get(authGuard, order_itemsController.find)
  .post(authGuard, validate(orderItemSchema), order_itemsController.create);

router
  .route("/:id")
  .get(authGuard, order_itemsController.findOne)
  .patch(
    authGuard,
    roleGuard("admin", "customer"),
    validate(orderItemSchema),
    order_itemsController.update,
  )
  .delete(authGuard, roleGuard("admin"), order_itemsController.delete);

export { router as order_itemsRouter };
