import { Router } from 'express';
import { addressRouter } from './address.routes.js';
import { customersRouter } from './customers.routes.js';
import { districtsRouter } from './districts.routes.js';
import { ordersRouter } from './orders.routes.js';
import { order_itemsRouter } from './order_items.routes.js';
import { delivery_stuffRouter } from './delivery_stuff.routes.js';
import { paymentsRouter } from './payments.routes.js';
import { water_productsRouter } from './water_products.routes.js';
import { authRouter } from './auth.routes.js';

const MainRouter = Router();

MainRouter.use('/address', addressRouter);
MainRouter.use('/customers', customersRouter);
MainRouter.use('/delivery_stuff', delivery_stuffRouter);
MainRouter.use('/districts', districtsRouter);
MainRouter.use('/order_items', order_itemsRouter);
MainRouter.use('/orders', ordersRouter);
MainRouter.use('/payments', paymentsRouter);
MainRouter.use('/water_products', water_productsRouter);
MainRouter.use('/auth', authRouter);

export default MainRouter;
