import { PaymentsModel } from '../model/payments.model.js';

export const paymentsController = {
  find: async (req, res, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page || '1'));
      const limit = Math.max(1, parseInt(req.query.limit || '10'));
      const skip = (page - 1) * limit;
      const [items, total] = await Promise.all([
        PaymentsModel.find({}).skip(skip).limit(limit).lean(),
        PaymentsModel.countDocuments({}),
      ]);
      res.json({ data: items, total, page, limit });
    } catch (err) {
      next(err);
    }
  },
  findOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const payment = await PaymentsModel.findById(id).lean();
      if (!payment) return res.status(404).json({ message: 'Not found' });
      res.json(payment);
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const payments = req.body;
      const newPayments = await PaymentsModel.create(payments);
      res.status(201).json(newPayments);
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updated = await PaymentsModel.updateOne({ _id: id }, data);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await PaymentsModel.deleteOne({ _id: id });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
