import { AddressModel } from '../model/address.model.js';

export const addressController = {
  find: async (req, res, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page || '1'));
      const limit = Math.max(1, parseInt(req.query.limit || '10'));
      const skip = (page - 1) * limit;
      const query = {};
      if (req.user && req.user.role === 'customer')
        query.customer_id = req.user.id;
      const [items, total] = await Promise.all([
        AddressModel.find(query)
          .populate('district_id')
          .skip(skip)
          .limit(limit)
          .lean(),
        AddressModel.countDocuments(query),
      ]);
      console.log(items);
      console.log(total);

      res.json({ data: items, total, page, limit });
    } catch (err) {
      next(err);
    }
  },
  findOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const address = await AddressModel.findById(id).lean();
      if (!address) return res.status(404).json({ message: 'Not found' });
      res.json(address);
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const address = req.body;
      const newAddress = await AddressModel.create(address);
      res.status(201).json(newAddress);
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updated = await AddressModel.updateOne({ _id: id }, data);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await AddressModel.deleteOne({ _id: id });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
