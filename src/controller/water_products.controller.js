import { Water_productModel } from "../model/water_products.model.js";

export const water_productsController = {
  find: async (req, res, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page || "1"));
      const limit = Math.max(1, parseInt(req.query.limit || "10"));
      const skip = (page - 1) * limit;
      const [items, total] = await Promise.all([
        Water_productModel.find({}).skip(skip).limit(limit).lean(),
        Water_productModel.countDocuments({}),
      ]);
      res.json({ data: items, total, page, limit });
    } catch (err) {
      next(err);
    }
  },
  findOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await Water_productModel.findById(id).lean();
      if (!product) return res.status(404).json({ message: "Not found" });
      res.json(product);
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const water_products = req.body;
      const newWater_products = await Water_productModel.create(water_products);
      res.status(201).json(newWater_products);
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updated = await Water_productModel.updateOne({ _id: id }, data);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await Water_productModel.deleteOne({ _id: id });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
