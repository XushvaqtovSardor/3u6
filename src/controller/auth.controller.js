import bcrypt from "bcrypt";
import { CustomersModel } from "../model/customers.model.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../helpers/jwt.js";
import { sendEmail } from "../helpers/sendEmail.js";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const authController = {
  register: async (req, res, next) => {
    try {
      const { name, email, phone, password, role } = req.body;
      const existing = await CustomersModel.findOne({
        $or: [{ phone }, { email }],
      });
      if (existing) return res.status(400).json({ message: "Phone or email already exists" });
      const hash = await bcrypt.hash(password, 10);
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      const user = await CustomersModel.create({
        name,
        email,
        phone,
        password: hash,
        role,
        otp,
        otpExpires,
      });
      await sendEmail(
        email,
        "Email Verification - OTP Code",
        `<h2>Welcome ${name}!</h2><p>Your OTP code is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`
      );
      res.status(201).json({
        message: "verify your email",
        userId: user._id,
        email,
        password,
      });
    } catch (err) {
      next(err);
    }
  },
  verifyOTP: async (req, res, next) => {
    try {
      const { userId, otp } = req.body;
      const user = await CustomersModel.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      if (user.isActive) return res.status(400).json({ message: "User already verified" });
      if (!user.otp || user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
      if (new Date() > user.otpExpires) return res.status(400).json({ message: "OTP expired" });
      user.isActive = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();
      res.json({ message: "Email verified successfully" });
    } catch (err) {
      next(err);
    }
  },
  resendOTP: async (req, res, next) => {
    try {
      const { userId } = req.body;
      const user = await CustomersModel.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      if (user.isActive) return res.status(400).json({ message: "User already verified" });
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
      await sendEmail(
        user.email,
        "Email Verification - New OTP Code",
        `<h2>Hello ${user.name}!</h2><p>Your new OTP code is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`
      );
      res.json({ message: "New OTP sent to your email" });
    } catch (err) {
      next(err);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await CustomersModel.findOne({ email });
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      if (!user.isActive)
        return res.status(403).json({ message: "Please verify your email first" });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: "Invalid credentials" });
      const mal = { id: user._id.toString(), role: user.role };
      const accessToken = signAccessToken(mal);
      const refreshToken = signRefreshToken(mal);
      user.refreshToken = refreshToken;
      await user.save();
      res.cookie("token", accessToken, {
        maxAge: 60 * 60 * 1000,
      });
      res.status(200).send({ accessToken: accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  },
  refresh: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(400).json({ message: "refreshToken required" });
      const mal = verifyRefreshToken(refreshToken);
      const user = await CustomersModel.findById(mal.id);
      if (!user || user.refreshToken !== refreshToken)
        return res.status(401).json({ message: "Invalid refresh token" });
      const newAccess = signAccessToken({
        id: user._id.toString(),
        role: user.role,
      });
      res.json({ accessToken: newAccess });
    } catch (err) {
      next(err);
    }
  },
  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.sendStatus(204);
      const mal = verifyRefreshToken(refreshToken);
      const user = await CustomersModel.findById(mal.id);
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  },
};

export default authController;
