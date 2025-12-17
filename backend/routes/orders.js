const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// Create order - user only
router.post('/', protect, orderCtrl.createOrder);

// Get single order - owner or admin
router.get('/:id', protect, orderCtrl.getOrderById);

// Get all orders - admin only
router.get('/', protect, admin, orderCtrl.getOrders);

// Update order status - admin only
router.put('/:id/status', protect, admin, orderCtrl.updateStatus);

module.exports = router;








//  const express = require('express');
//  const router = express.Router();
//  const orderCtrl = require('../controllers/orderController');
//  const { protect, admin } = require('../middleware/auth');
//  router.post('/', protect, orderCtrl.createOrder);
//  router.get('/:id', protect, orderCtrl.getOrderById);
//  router.get('/', protect, admin, orderCtrl.getOrders); // admin only list
//  router.put('/:id/status', protect, admin, orderCtrl.updateStatus);
//  module.exports = router;