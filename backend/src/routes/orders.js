import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orders.js';
const router = express.Router();
router.post('/', authenticate, createOrder);
router.get('/my', authenticate, getMyOrders);
router.get('/', authenticate, requireAdmin, getAllOrders);
router.patch('/:id/status', authenticate, requireAdmin, updateOrderStatus);
export default router;
