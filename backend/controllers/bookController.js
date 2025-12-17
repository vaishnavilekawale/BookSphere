const Book = require('../models/Book');
 const { getPagination } = require('../utils/pagination');
 
exports.getBooks = async (req, res, next) => {
 try {
 const { page, limit, skip } = getPagination(req);
 const { q, genre, author } = req.query;
 const filter = {};
 if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { author: new RegExp(q,
 'i') }];
 if (genre) filter.genre = genre;
 if (author) filter.author = new RegExp(author, 'i');
 const [total, books] = await Promise.all([
 Book.countDocuments(filter),
 Book.find(filter).skip(skip).limit(limit).sort({ createdAt:-1 })
 ]);
 res.json({ page, limit, total, totalPages: Math.ceil(total / limit),
 books });
 } catch (err) {
 next(err);
 }
 };
 exports.getBookById = async (req, res, next) => {
 try {
 const book = await Book.findById(req.params.id);
 if (!book) return res.status(404).json({ message: 'Book not found' });
 res.json(book);
 } catch (err) {
 next(err);
 }
 };
 exports.createBook = async (req, res, next) => {
 try {
 const data = req.body;
 const book = await Book.create(data);
 res.status(201).json(book);
 } catch (err) {
 next(err);
 }
 };
 exports.updateBook = async (req, res, next) => {
 try {
 const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new:
 true, runValidators: true });
 if (!book) return res.status(404).json({ message: 'Book not found' });
 
res.json(book);
 } catch (err) {
 next(err);
 }
 };
 exports.deleteBook = async (req, res, next) => {
 try {
 const book = await Book.findByIdAndDelete(req.params.id);
 if (!book) return res.status(404).json({ message: 'Book not found' });
 res.json({ message: 'Book deleted' });
 } catch (err) {
 next(err);
 }
 };



// const Book = require('../models/Book');

// // GET ALL BOOKS
// exports.getBooks = async (req, res, next) => {
//   try {
//     const books = await Book.find().sort({ createdAt: -1 });
//     res.json({ books });
//   } catch (err) {
//     next(err);
//   }
// };

// // GET BOOK BY ID
// exports.getBookById = async (req, res, next) => {
//   try {
//     const book = await Book.findById(req.params.id);
//     if (!book) return res.status(404).json({ message: 'Book not found' });
//     res.json(book);
//   } catch (err) {
//     next(err);
//   }
// };

// // CREATE BOOK WITH IMAGE
// exports.createBook = async (req, res, next) => {
//   try {
//     const data = req.body;

//     if (req.file && req.file.path) {
//       data.imageUrl = req.file.path; // Cloudinary URL auto added
//     }

//     const book = await Book.create(data);
//     res.status(201).json(book);
//   } catch (err) {
//     next(err);
//   }
// };

// // UPDATE BOOK WITH IMAGE
// exports.updateBook = async (req, res, next) => {
//   try {
//     const data = req.body;

//     if (req.file && req.file.path) {
//       data.imageUrl = req.file.path;
//     }

//     const book = await Book.findByIdAndUpdate(
//       req.params.id,
//       data,
//       { new: true, runValidators: true }
//     );

//     if (!book) return res.status(404).json({ message: 'Book not found' });

//     res.json(book);
//   } catch (err) {
//     next(err);
//   }
// };

// // DELETE BOOK
// exports.deleteBook = async (req, res, next) => {
//   try {
//     const book = await Book.findByIdAndDelete(req.params.id);
//     if (!book) return res.status(404).json({ message: 'Book not found' });

//     res.json({ message: 'Book deleted' });
//   } catch (err) {
//     next(err);
//   }
// };
