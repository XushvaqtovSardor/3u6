import { model, Schema } from 'mongoose';
const customersSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'delivery_staff', 'customer'],
    default: 'customer',
  },
  refreshToken: {
    type: String,
    default: null,
  },
});
export const CustomersModel = model('customers', customersSchema);
