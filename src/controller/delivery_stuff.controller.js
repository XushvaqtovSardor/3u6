import { Delivery_stuffModel } from '../model/delivery_stuff.model.js';

export const delivery_stuffController = {
  find: async (req, res, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page || '1'));
      const limit = Math.max(1, parseInt(req.query.limit || '10'));
      const skip = (page - 1) * limit;
      const [items, total] = await Promise.all([
        Delivery_stuffModel.find({}).skip(skip).limit(limit).lean(),
        Delivery_stuffModel.countDocuments({}),
      ]);
      res.json({ data: items, total, page, limit });
    } catch (err) {
      next(err);
    }
  },
  findOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const staff = await Delivery_stuffModel.findById(id).lean();
      if (!staff) return res.status(404).json({ message: 'Not found' });
      res.json(staff);
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const delivery_stuff = req.body;
      const newDelivery_stuf = await Delivery_stuffModel.create(delivery_stuff);
      res.status(201).json(newDelivery_stuf);
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updated = await Delivery_stuffModel.updateOne({ _id: id }, data);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await Delivery_stuffModel.deleteOne({ _id: id });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
