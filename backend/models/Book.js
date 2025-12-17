 const mongoose = require('mongoose');
 const bookSchema = new mongoose.Schema({
 title: { type: String, required: true, index: true },
 author: { type: String, required: true, index: true },
 price: { type: Number, required: true },
 genre: { type: String, index: true },
 stock: { type: Number, default: 0 },
 isbn: { type: String, unique: true, sparse: true },
 description: { type: String },
 imageUrl: { type: String },
 }, { timestamps: true });
 module.exports = mongoose.model('Book', bookSchema);