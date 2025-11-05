import mongoose, { model, Schema } from "mongoose";

const OrdersSchema = new Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
  },
  Delivery_staff_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "delivery_stuffs",
    default: null,
  },
  order_date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "delivering", "recieved"],
    require: true,
  },
});
export const ordersModel = model("orders", OrdersSchema);
