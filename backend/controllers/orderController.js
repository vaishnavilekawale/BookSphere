const Order = require('../models/Order');
const Book = require('../models/Book');
const mongoose = require('mongoose');

// CREATE ORDER
exports.createOrder = async (req, res, next) => {
  try {
    const { items: rawItems, paymentStatus = 'unpaid' } = req.body;
    const items = Array.isArray(rawItems) ? rawItems : [];

    if (items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Normalize items
    const normalized = items.map((it) => {
      const qty = Number(it.qty) || 0;
      let bookId = null;

      if (it.bookId) bookId = it.bookId;
      else if (it.book) {
        if (typeof it.book === 'string') bookId = it.book;
        else if (it.book._id) bookId = it.book._id;
        else if (it.book.id) bookId = it.book.id;
      } else if (it.id) {
        bookId = it.id;
      }

      return { bookId, qty };
    });

    // Validate IDs and qty
    for (const it of normalized) {
      if (!mongoose.Types.ObjectId.isValid(it.bookId)) {
        return res.status(400).json({ message: `Invalid bookId: ${it.bookId}` });
      }
      if (it.qty <= 0) {
        return res.status(400).json({ message: `Invalid quantity for ${it.bookId}` });
      }
    }

    let totalPrice = 0;
    const itemsWithPrice = [];

    for (const it of normalized) {
      const book = await Book.findById(it.bookId);
      if (!book) return res.status(404).json({ message: `Book not found: ${it.bookId}` });

      if (book.stock < it.qty)
        return res.status(400).json({ message: `Insufficient stock for ${book.title}` });

      const price = Number(book.price) || 0;
      totalPrice += price * it.qty;

      itemsWithPrice.push({
        book: book._id,
        qty: it.qty,
        price
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: itemsWithPrice,
      totalPrice,
      paymentStatus
    });

    // reduce stock
    for (const it of normalized) {
      await Book.findByIdAndUpdate(it.bookId, { $inc: { stock: -it.qty } });
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// GET ORDER BY ID (User or Admin)
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.book')
      .populate('user', '-password');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // allow only owner OR admin
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

// GET ALL ORDERS (ADMIN)
exports.getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [total, orders] = await Promise.all([
      Order.countDocuments(filter),
      Order.find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
    ]);

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      orders
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE ORDER STATUS (ADMIN)
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
};



// const Order = require('../models/Order');
// const Book = require('../models/Book');
// const mongoose = require('mongoose');

// // CREATE ORDER
// exports.createOrder = async (req, res, next) => {
//   try {
//     const { items, paymentStatus = 'unpaid' } = req.body;

//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: 'No items in order' });
//     }

//     // items coming from frontend should be [{ bookId: "...", qty: n }, ...]
//     // Validate structure first
//     for (const it of items) {
//       if (!it || (!it.bookId && it.bookId !== 0)) {
//         return res.status(400).json({ message: 'Each item must contain bookId and qty' });
//       }
//       if (!mongoose.Types.ObjectId.isValid(it.bookId)) {
//         return res.status(400).json({ message: `Invalid book ID: ${it.bookId}` });
//       }
//       if (!it.qty || typeof it.qty !== 'number' || it.qty <= 0) {
//         return res.status(400).json({ message: `Invalid quantity for book ${it.bookId}` });
//       }
//     }

//     let totalPrice = 0;
//     const itemsWithPrice = [];

//     // Optionally: use transaction if your MongoDB & Mongoose setup supports it
//     // For simplicity we do sequential checks
//     for (const it of items) {
//       const book = await Book.findById(it.bookId);
//       if (!book) {
//         return res.status(404).json({ message: `Book not found: ${it.bookId}` });
//       }

//       if (book.stock < it.qty) {
//         return res.status(400).json({ message: `Insufficient stock for ${book.title || book._id}` });
//       }

//       const price = Number(book.price) || 0;

//       itemsWithPrice.push({
//         book: book._id,
//         qty: it.qty,
//         price
//       });

//       totalPrice += price * it.qty;
//     }

//     // Create order
//     const order = await Order.create({
//       user: req.user._id,
//       items: itemsWithPrice,
//       totalPrice,
//       paymentStatus
//     });

//     // Reduce stock for each book (sequentially)
//     // You could make these parallel or use a transaction if needed
//     for (const it of items) {
//       await Book.findByIdAndUpdate(it.bookId, { $inc: { stock: -it.qty } });
//     }

//     res.status(201).json(order);
//   } catch (err) {
//     next(err);
//   }
// };

// // GET ORDER BY ID
// exports.getOrderById = async (req, res, next) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('items.book')
//       .populate('user', '-password');

//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Not authorized to view this order' });
//     }

//     res.json(order);
//   } catch (err) {
//     next(err);
//   }
// };

// // GET ALL ORDERS (ADMIN)
// exports.getOrders = async (req, res, next) => {
//   try {
//     const page = parseInt(req.query.page, 10) || 1;
//     const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
//     const skip = (page - 1) * limit;

//     const filter = {};
//     if (req.query.status) filter.status = req.query.status;

//     const [total, orders] = await Promise.all([
//       Order.countDocuments(filter),
//       Order.find(filter)
//         .populate('user', 'name email')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//     ]);

//     res.json({
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit),
//       orders
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // UPDATE ORDER STATUS (ADMIN)
// exports.updateStatus = async (req, res, next) => {
//   try {
//     const { status, paymentStatus } = req.body;

//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     // Validate incoming status (optional)
//     const allowedStatus = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
//     if (status && !allowedStatus.includes(status)) {
//       return res.status(400).json({ message: 'Invalid status value' });
//     }

//     if (status) order.status = status;
//     if (paymentStatus) {
//       const allowedPayment = ['unpaid', 'paid'];
//       if (!allowedPayment.includes(paymentStatus)) {
//         return res.status(400).json({ message: 'Invalid paymentStatus value' });
//       }
//       order.paymentStatus = paymentStatus;
//     }

//     await order.save();
//     res.json(order);
//   } catch (err) {
//     next(err);
//   }
// };








// const Order = require('../models/Order');
// const Book = require('../models/Book');
// const mongoose = require('mongoose');

// // CREATE ORDER
// exports.createOrder = async (req, res, next) => {
//   try {
//     const { items, paymentStatus = 'unpaid' } = req.body;
//     if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });

//     let totalPrice = 0;
//     const itemsWithPrice = [];

//     for (const it of items) {
//       if (!mongoose.Types.ObjectId.isValid(it.bookId)) {
//         return res.status(400).json({ message: `Invalid book ID: ${it.bookId}` });
//       }

//       const book = await Book.findById(it.bookId);
//       if (!book) return res.status(404).json({ message: `Book not found: ${it.bookId}` });
//       if (book.stock < it.qty) return res.status(400).json({ message: `Insufficient stock for ${book.title}` });

//       itemsWithPrice.push({ book: book._id, qty: it.qty, price: book.price });
//       totalPrice += book.price * it.qty;
//     }

//     const order = await Order.create({
//       user: req.user._id,
//       items: itemsWithPrice,
//       totalPrice,
//       paymentStatus,
//     });

//     // Reduce stock
//     for (const it of items) {
//       await Book.findByIdAndUpdate(it.bookId, { $inc: { stock: -it.qty } });
//     }

//     res.status(201).json(order);
//   } catch (err) {
//     next(err);
//   }
// };

// // GET ORDER BY ID
// exports.getOrderById = async (req, res, next) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('items.book')
//       .populate('user', '-password');
//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Not authorized to view this order' });
//     }

//     res.json(order);
//   } catch (err) {
//     next(err);
//   }
// };

// // GET ALL ORDERS (ADMIN)
// exports.getOrders = async (req, res, next) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const skip = (page - 1) * limit;
//     const filter = {};

//     if (req.query.status) filter.status = req.query.status;

//     const [total, orders] = await Promise.all([
//       Order.countDocuments(filter),
//       Order.find(filter)
//         .populate('user', 'name email')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit))
//     ]);

//     res.json({ page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit), orders });
//   } catch (err) {
//     next(err);
//   }
// };

// // UPDATE ORDER STATUS (ADMIN)
// exports.updateStatus = async (req, res, next) => {
//   try {
//     const { status, paymentStatus } = req.body;
//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     if (status) order.status = status;
//     if (paymentStatus) order.paymentStatus = paymentStatus;

//     await order.save();
//     res.json(order);
//   } catch (err) {
//     next(err);
//   }
// };



//  const Order = require('../models/Order');
//  const Book = require('../models/Book');
//  const { getPagination } = require('../utils/pagination');
//  exports.createOrder = async (req, res, next) => {
//  try {
//  const { items, paymentStatus = 'unpaid' } = req.body; // items: [{book, qty}]
//  if (!items || items.length === 0) return res.status(400).json({ message:
//  'No items in order' });
//  // calculate totals and ensure stock
//  let totalPrice = 0;
 
// const itemsWithPrice = [];
//  for (const it of items) {
//  const book = await Book.findById(it.book);
//  if (!book) return res.status(404).json({ message: `Book not found $
//  {it.book}` });
//  if (book.stock < it.qty) return res.status(400).json({ message:
//  `Insufficient stock for ${book.title}` });
//  itemsWithPrice.push({ book: book._id, qty: it.qty, price: book.price });
//  totalPrice += book.price * it.qty;
//  }
//  const order = await Order.create({ user: req.user._id, items:
//  itemsWithPrice, totalPrice, paymentStatus });
//  // reduce stock
//  for (const it of items) {
//  await Book.findByIdAndUpdate(it.book, { $inc: { stock:-it.qty } });
//  }
//  res.status(201).json(order);
//  } catch (err) {
//  next(err);
//  }
//  };
//  exports.getOrderById = async (req, res, next) => {
//  try {
//  const order = await
//  Order.findById(req.params.id).populate('items.book').populate('user', 'password');
//  if (!order) return res.status(404).json({ message: 'Order not found' });
//  // allow only owner or admin
//  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//  return res.status(403).json({ message: 'Not authorized to view this order' });
//  }
//  res.json(order);
//  } catch (err) {
//  next(err);
//  }
//  };
//  exports.getOrders = async (req, res, next) => {
//  try {
//  const { page, limit, skip } = getPagination(req);
//  const filter = {};
 
// if (req.query.status) filter.status = req.query.status;
//  const [total, orders] = await Promise.all([
//  Order.countDocuments(filter),
//  Order.find(filter).populate('user', 'name email').sort({ createdAt:-1 }).skip(skip).limit(limit)
//  ]);
//  res.json({ page, limit, total, totalPages: Math.ceil(total / limit),
//  orders });
//  } catch (err) {
//  next(err);
//  }
//  };
//  exports.updateStatus = async (req, res, next) => {
//  try {
//  const { status, paymentStatus } = req.body;
//  const order = await Order.findById(req.params.id);
//  if (!order) return res.status(404).json({ message: 'Order not found' });
//  if (status) order.status = status;
//  if (paymentStatus) order.paymentStatus = paymentStatus;
//  await order.save();
//  res.json(order);
//  } catch (err) {
//  next(err);
//  }
//  };