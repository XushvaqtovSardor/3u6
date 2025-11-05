import { Order_itemsModel } from "../model/order_items.model.js";

export const order_itemsController = {
  find: async (req, res, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page || "1"));
      const limit = Math.max(1, parseInt(req.query.limit || "10"));
      const skip = (page - 1) * limit;
      const [items, total] = await Promise.all([
        Order_itemsModel.find({}).skip(skip).limit(limit).lean(),
        Order_itemsModel.countDocuments({}),
      ]);
      res.json({ data: items, total, page, limit });
    } catch (err) {
      next(err);
    }
  },
  findOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await Order_itemsModel.findById(id).lean();
      if (!item) return res.status(404).json({ message: "Not found" });
      res.json(item);
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const order_items = req.body;
      const newOrder_items = await Order_itemsModel.create(order_items);
      res.status(201).json(newOrder_items);
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updated = await Order_itemsModel.updateOne({ _id: id }, data);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await Order_itemsModel.deleteOne({ _id: id });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
