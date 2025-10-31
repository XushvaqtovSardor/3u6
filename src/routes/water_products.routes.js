import { Router } from 'express';
import { water_productsController } from '../controller/water_products.controller.js';
import { authGuard, roleGuard } from '../helpers/auth.js';
import { validate, waterProductSchema } from '../validation/validation.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Water Products
 *   description: Water product management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WaterProduct:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         volume:
 *           type: number
 */

/**
 * @swagger
 * /water_products:
 *   get:
 *     summary: Get all water products
 *     tags: [Water Products]
 *     responses:
 *       200:
 *         description: List of all water products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WaterProduct'
 *   post:
 *     summary: Create new water product
 *     tags: [Water Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WaterProduct'
 *     responses:
 *       201:
 *         description: Water product created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /water_products/{id}:
 *   get:
 *     summary: Get water product by ID
 *     tags: [Water Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Water product found
 *       404:
 *         description: Water product not found
 *   patch:
 *     summary: Update water product
 *     tags: [Water Products]
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
 *             $ref: '#/components/schemas/WaterProduct'
 *     responses:
 *       200:
 *         description: Water product updated
 *       404:
 *         description: Water product not found
 *   delete:
 *     summary: Delete water product
 *     tags: [Water Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Water product deleted
 *       404:
 *         description: Water product not found
 */

router
  .route('/')
  .get(water_productsController.find)
  .post(
    authGuard,
    roleGuard('admin'),
    validate(waterProductSchema),
    water_productsController.create
  );

router
  .route('/:id')
  .get(water_productsController.findOne)
  .patch(
    authGuard,
    roleGuard('admin'),
    validate(waterProductSchema),
    water_productsController.update
  )
  .delete(authGuard, roleGuard('admin'), water_productsController.delete);

export { router as water_productsRouter };
