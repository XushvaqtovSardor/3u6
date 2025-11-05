import { model, Schema } from "mongoose";
const Water_productSchema = new Schema({
  name: String,
  volume_liters: Number,
  price: Number,
  stock: {
    type: Number,
    default: 0,
  },
});
export const Water_productModel = model("water_products", Water_productSchema);
