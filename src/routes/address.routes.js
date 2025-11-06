import { Router } from "express";
import { addressController } from "../controller/address.controller.js";
import { authGuard, roleGuard } from "../helpers/auth.js";
import { validate, addressSchema } from "../validation/validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Address management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - name
 *         - location
 *         - district_id
 *       properties:
 *         name:
 *           type: string
 *         customer_id:
 *           type: string
 *           format: objectId
 *         address:
 *           type: string
 *         location:
 *           type: string
 *         district_id:
 *           type: string
 *           format: objectId
 */

/**
 * @swagger
 * /address:
 *   get:
 *     summary: Get all addresses
 *     tags: [Address]
 *     responses:
 *       200:
 *         description: List of all addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *   post:
 *     summary: Create new address
 *     tags: [Address]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Address created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /address/{id}:
 *   get:
 *     summary: Get address by ID
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address found
 *       404:
 *         description: Address not found
 *   patch:
 *     summary: Update address
 *     tags: [Address]
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
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Address updated
 *       404:
 *         description: Address not found
 *   delete:
 *     summary: Delete address
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted
 *       404:
 *         description: Address not found
 */

router
  .route("/")
  .get(authGuard, roleGuard("admin"), addressController.find)
  .post(
    authGuard,
    roleGuard("admin", "customer"),
    validate(addressSchema),
    addressController.create
  );

router
  .route("/:id")
  .get(authGuard, roleGuard("admin", "delivery_staff"), addressController.findOne)
  .patch(
    authGuard,
    roleGuard("admin", "customer"),
    validate(addressSchema),
    addressController.update
  )
  .delete(authGuard, roleGuard("admin", "delivery_staff"), addressController.delete);

export { router as addressRouter };
