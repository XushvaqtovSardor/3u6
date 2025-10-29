import { DistrictsModel } from '../model/districts.model.js';

export const districtsController = {
  find: async (req, res, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page || '1'));
      const limit = Math.max(1, parseInt(req.query.limit || '10'));
      const skip = (page - 1) * limit;
      const [items, total] = await Promise.all([
        DistrictsModel.find({}).skip(skip).limit(limit).lean(),
        DistrictsModel.countDocuments({}),
      ]);
      res.json({ data: items, total, page, limit });
    } catch (err) {
      next(err);
    }
  },
  findOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const district = await DistrictsModel.findById(id).lean();
      if (!district) return res.status(404).json({ message: 'Not found' });
      res.json(district);
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const districts = req.body;
      const newDistricts = await DistrictsModel.create(districts);
      res.status(201).json(newDistricts);
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updated = await DistrictsModel.updateOne({ _id: id }, data);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await DistrictsModel.deleteOne({ _id: id });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
