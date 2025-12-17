const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [orderItemSchema], required: true },
  totalPrice: { type: Number, required: true, min: 0 },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);





// // Change Order Status
// const changeStatus = async (id, statusLabel) => {
//   try {
//     if (!id) {
//       alert("Order ID missing!");
//       return;
//     }

//     const label = String(statusLabel || "").trim().toLowerCase();

//     // Map UI options → Backend ENUM
//     const map = {
//       pending: "pending",
//       process: "processing",
//       processing: "processing",
//       shipped: "shipped",
//       complete: "delivered",
//       completed: "delivered",
//       delivered: "delivered",
//       cancel: "cancelled",
//       cancelled: "cancelled"
//     };

//     const status = map[label];

//     if (!status) {
//       alert("Invalid status: " + statusLabel);
//       return;
//     }

//     await api.put(`/orders/${id}/status`, { status });

//     await fetch(); // refresh orders
//   } catch (err) {
//     console.error("Status change failed", err);
//     alert(err.response?.data?.message || "Failed to change status");
//   }
// };









  
// ...existing code...


//  const mongoose = require('mongoose');
//  const orderItemSchema = new mongoose.Schema({
//  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
//  qty: { type: Number, required: true },
//  price: { type: Number, required: true },
//  });
//  const orderSchema = new mongoose.Schema({
//  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//  items: [orderItemSchema],
//  totalPrice: { type: Number, required: true },
//  status: { type: String, enum: ['pending', 'processing', 'shipped',
//  'delivered', 'cancelled'], default: 'pending' },
//  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
//  }, { timestamps: true });
//  module.exports = mongoose.model('Order', orderSchema);