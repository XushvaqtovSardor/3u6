import mongoose from 'mongoose';
import { ordersModel } from '../model/orders.model.js';
import { Order_itemsModel } from '../model/order_items.model.js';
import { Water_productModel } from '../model/water_products.model.js';

export const ordersController = {
  find: async (req, res, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page || '1'));
      const limit = Math.max(1, parseInt(req.query.limit || '10'));
      const skip = (page - 1) * limit;
      const query = {};
      if (req.user && req.user.role === 'customer')
        query.customer_id = req.user.id;
      const [items, total] = await Promise.all([
        ordersModel.find(query).skip(skip).limit(limit).lean(),
        ordersModel.countDocuments(query),
      ]);
      res.json({ data: items, total, page, limit });
    } catch (err) {
      next(err);
    }
  },
  findOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await ordersModel.findById(id).lean();
      if (!order) return res.status(404).json({ message: 'Not found' });
      if (
        req.user &&
        req.user.role !== 'admin' &&
        order.customer_id?.toString() !== req.user.id
      )
        return res.status(403).json({ message: 'Forbidden' });
      res.json(order);
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const { customer_id, items = [], ...rest } = req.body;
        const orderDoc = await ordersModel.create([{ customer_id, ...rest }], {
          session,
        });
        const order = orderDoc[0];
        for (const it of items) {
          const product = await Water_productModel.findById(
            it.product_id
          ).session(session);
          if (!product)
            throw Object.assign(new Error('Product not found'), {
              status: 400,
            });
          if (product.stock < (it.quantity || 0))
            throw Object.assign(new Error('Insufficient stock'), {
              status: 400,
            });
          product.stock = product.stock - (it.quantity || 0);
          await product.save({ session });
          await Order_itemsModel.create(
            [
              {
                order_id: order._id,
                product_id: it.product_id,
                quantity: it.quantity || 0,
                total_price: it.total_price || 0,
              },
            ],
            { session }
          );
        }
        res.status(201).json(order);
      });
    } catch (err) {
      next(err);
    } finally {
      session.endSession();
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updated = await ordersModel.updateOne({ _id: id }, data);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await ordersModel.deleteOne({ _id: id });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
