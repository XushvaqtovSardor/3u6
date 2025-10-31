import bcrypt from 'bcrypt';
import { CustomersModel } from '../model/customers.model.js';

export const customersController = {
  find: async (req, res, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page || '1'));
      const limit = Math.max(1, parseInt(req.query.limit || '10'));
      const skip = (page - 1) * limit;
      const [items, total] = await Promise.all([
        CustomersModel.find({})
          .select('-password -refreshToken')
          .skip(skip)
          .limit(limit)
          .lean(),
        CustomersModel.countDocuments({}),
      ]);
      res.json({ data: items, total, page, limit });
    } catch (err) {
      next(err);
    }
  },
  findOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const customer = await CustomersModel.findById(id)
        .select('-password -refreshToken')
        .lean();
      if (!customer) return res.status(404).json({ message: 'Not found' });
      res.json(customer);
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const { password, ...customer } = req.body;
      const hash = await bcrypt.hash(password, 10);
      const newCustomer = await CustomersModel.create({
        ...customer,
        password: hash,
      });
      const result = newCustomer.toObject();
      delete result.password;
      delete result.refreshToken;
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { password, ...data } = req.body;
      const updateData = { ...data };
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }
      const updated = await CustomersModel.updateOne({ _id: id }, updateData);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await CustomersModel.deleteOne({ _id: id });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
