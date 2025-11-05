import { Router } from "express";
import { districtsController } from "../controller/districts.controller.js";
import { authGuard, roleGuard } from "../helpers/auth.js";
import { validate, districtSchema } from "../validation/validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Districts
 *   description: District management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     District:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 */

/**
 * @swagger
 * /districts:
 *   get:
 *     summary: Get all districts
 *     tags: [Districts]
 *     responses:
 *       200:
 *         description: List of all districts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/District'
 *   post:
 *     summary: Create new district
 *     tags: [Districts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/District'
 *     responses:
 *       201:
 *         description: District created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /districts/{id}:
 *   get:
 *     summary: Get district by ID
 *     tags: [Districts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: District found
 *       404:
 *         description: District not found
 *   patch:
 *     summary: Update district
 *     tags: [Districts]
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
 *             $ref: '#/components/schemas/District'
 *     responses:
 *       200:
 *         description: District updated
 *       404:
 *         description: District not found
 *   delete:
 *     summary: Delete district
 *     tags: [Districts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: District deleted
 *       404:
 *         description: District not found
 */

router
  .route("/")
  .get(districtsController.find)
  .post(
    authGuard,
    roleGuard("admin"),
    validate(districtSchema),
    districtsController.create,
  );

router
  .route("/:id")
  .get(districtsController.findOne)
  .patch(
    authGuard,
    roleGuard("admin"),
    validate(districtSchema),
    districtsController.update,
  )
  .delete(authGuard, roleGuard("admin"), districtsController.delete);

export { router as districtsRouter };
