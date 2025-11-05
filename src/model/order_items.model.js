import mongoose, { model, Schema } from "mongoose";

const Order_itemsSchema = new Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "orders",
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "water_products",
  },
  quantity: {
    type: Number,
    default: null,
  },
  total_price: {
    type: Number,
    default: null,
  },
});
export const Order_itemsModel = model("order_items", Order_itemsSchema);
