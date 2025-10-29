import mongoose, { model, Schema, Types } from 'mongoose';
const Delivery_stuff = new Schema({
  name: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  vehicle_number: {
    type: Number,
    default: 0,
  },
  district_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'districts',
  },
});
export const Delivery_stuffModel = model('delivery_stuffs', Delivery_stuff);
