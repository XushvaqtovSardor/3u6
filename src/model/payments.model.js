import mongoose, { model, Schema } from "mongoose";
const PaymentsSchema = new Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: 0,
  },
  payment_date: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    require: true,
  },
  method: {
    type: String,
    enum: ["pending", "paid"],
  },
});
export const PaymentsModel = model("payments", PaymentsSchema);
