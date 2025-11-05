import { Router } from "express";
import { authController } from "../controller/auth.controller.js";
import { validate, authSchemas } from "../validation/validation.js";

const router = Router();

router.post(
  "/register",
  validate(authSchemas.register),
  authController.register,
);
router.post(
  "/verifyEmail",
  validate(authSchemas.verifyOTP),
  authController.verifyOTP,
);
router.post(
  "/resendEmail",
  validate(authSchemas.resendOTP),
  authController.resendOTP,
);
router.post("/login", validate(authSchemas.login), authController.login);
router.post("/refresh", validate(authSchemas.refresh), authController.refresh);
router.post("/logout", validate(authSchemas.logout), authController.logout);

export { router as authRouter };
