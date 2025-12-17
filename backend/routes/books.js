 const express = require('express');
 const router = express.Router();
 const { protect, admin } = require('../middleware/auth');
 const bookCtrl = require('../controllers/bookController');
 router.get('/', bookCtrl.getBooks);
 router.get('/:id', bookCtrl.getBookById);
 router.post('/', protect, admin, bookCtrl.createBook);
 router.put('/:id', protect, admin, bookCtrl.updateBook);
 router.delete('/:id', protect, admin, bookCtrl.deleteBook);
 module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { protect, admin } = require('../middleware/auth');
// const bookCtrl = require('../controllers/bookController');
// const upload = require('../middleware/upload');

// // Public
// router.get('/', bookCtrl.getBooks);
// router.get('/:id', bookCtrl.getBookById);

// // Admin
// router.post('/', protect, admin, upload.single("image"), bookCtrl.createBook);
// router.put('/:id', protect, admin, upload.single("image"), bookCtrl.updateBook);
// router.delete('/:id', protect, admin, bookCtrl.deleteBook);

// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const { protect, admin } = require('../middleware/auth');
// const bookCtrl = require('../controllers/bookController');

// // Image upload setup
// const upload = require('../middleware/upload');

// // -------------------
// //   UPLOAD ROUTE
// // -------------------
// router.post('/upload', protect, admin, upload.single('image'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: "Image upload failed" });
//   }
//   res.json({ imageUrl: req.file.path });
// });

// // -------------------
// //   BOOK ROUTES
// // -------------------
// router.get('/', bookCtrl.getBooks);            // Public
// router.get('/:id', bookCtrl.getBookById);      // Public

// router.post('/', protect, admin, bookCtrl.createBook);    // Admin only
// router.put('/:id', protect, admin, bookCtrl.updateBook);  // Admin only
// router.delete('/:id', protect, admin, bookCtrl.deleteBook); // Admin only

// module.exports = router;

//  const express = require('express');
//  const router = express.Router();
//  const { protect, admin } = require('../middleware/auth');
//  const bookCtrl = require('../controllers/bookController');
//  router.get('/', bookCtrl.getBooks);
//  router.get('/:id', bookCtrl.getBookById);
//  router.post('/', protect, admin, bookCtrl.createBook);
//  router.put('/:id', protect, admin, bookCtrl.updateBook);
//  router.delete('/:id', protect, admin, bookCtrl.deleteBook);
//  module.exports = router;