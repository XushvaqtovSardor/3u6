import mongoose, { Schema, model } from "mongoose";
export const AdressSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      require: true,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      default: null,
    },
    address: {
      type: String,
      trim: true,
      default: null,
    },
    location: {
      type: String,
      trim: true,
      require: true,
    },
    district_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "districts",
    },
  },
  { timestamps: true }
);
export const AddressModel = model("address", AdressSchema);
