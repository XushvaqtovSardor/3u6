import Joi from "joi";

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return res.status(400).json({ message: "Validation error", errors });
    }
    next();
  };
};

export const authSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .pattern(/^\+\d{9,15}$/)
      .required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("admin", "delivery_staff", "customer"),
  }),
  verifyOTP: Joi.object({
    userId: Joi.string().hex().length(24).required(),
    otp: Joi.string().length(6).required(),
  }),
  resendOTP: Joi.object({
    userId: Joi.string().hex().length(24).required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  refresh: Joi.object({
    refreshToken: Joi.string().required(),
  }),
  logout: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

export const customerSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  phone: Joi.string().min(9).max(20),
  password: Joi.string().min(6),
  role: Joi.string().valid("admin", "delivery_staff", "customer"),
}).min(1);

export const orderSchema = Joi.object({
  customer_id: Joi.string().hex().length(24),
  Delivery_staff_id: Joi.string().hex().length(24),
  status: Joi.string().valid("pending", "accepted", "delivering", "recieved"),
  items: Joi.array().items(
    Joi.object({
      product_id: Joi.string().hex().length(24).required(),
      quantity: Joi.number().integer().min(1).required(),
      total_price: Joi.number().min(0).required(),
    }),
  ),
}).min(1);

export const waterProductSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  volume_liters: Joi.number().min(0),
  price: Joi.number().min(0),
  stock: Joi.number().integer().min(0),
}).min(1);

export const addressSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  customer_id: Joi.string().hex().length(24),
  address: Joi.string().max(500),
  location: Joi.string(),
  district_id: Joi.string().hex().length(24),
}).min(1);

export const districtSchema = Joi.object({
  name: Joi.string().min(2).max(100),
}).min(1);

export const deliveryStaffSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  phone: Joi.string().min(9).max(20),
  vehicle_number: Joi.number().integer().min(0),
  district_id: Joi.string().hex().length(24),
}).min(1);

export const paymentSchema = Joi.object({
  order_id: Joi.string().hex().length(24),
  payment_date: Joi.date(),
  amount: Joi.number().min(0),
  method: Joi.string().valid("pending", "paid"),
}).min(1);

export const orderItemSchema = Joi.object({
  order_id: Joi.string().hex().length(24),
  product_id: Joi.string().hex().length(24),
  quantity: Joi.number().integer().min(1),
  total_price: Joi.number().min(0),
}).min(1);
