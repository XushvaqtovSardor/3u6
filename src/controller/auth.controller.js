import bcrypt from 'bcrypt';
import { CustomersModel } from '../model/customers.model.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../helpers/jwt.js';

export const authController = {
  register: async (req, res, next) => {
    try {
      const { name, phone, password, role } = req.body;
      const hash = await bcrypt.hash(password, 10);
      const user = await CustomersModel.create({
        name,
        phone,
        password: hash,
        role,
      });
      res.status(201).json({ id: user._id, name: user.name, role: user.role });
    } catch (err) {
      next(err);
    }
  },
  login: async (req, res, next) => {
    try {
      const { phone, password } = req.body;
      const user = await CustomersModel.findOne({ phone });
      if (!user)
        return res.status(401).json({ message: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ message: 'Invalid credentials' });
      const payload = { id: user._id.toString(), role: user.role };
      const accessToken = signAccessToken(payload);
      const refreshToken = signRefreshToken(payload);
      user.refreshToken = refreshToken;
      await user.save();
      res.json({ accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  },
  refresh: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken)
        return res.status(400).json({ message: 'refreshToken required' });
      const payload = verifyRefreshToken(refreshToken);
      const user = await CustomersModel.findById(payload.id);
      if (!user || user.refreshToken !== refreshToken)
        return res.status(401).json({ message: 'Invalid refresh token' });
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
      const payload = verifyRefreshToken(refreshToken);
      const user = await CustomersModel.findById(payload.id);
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
