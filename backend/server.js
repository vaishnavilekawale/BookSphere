 const express = require('express');
 const cors = require('cors');
 const morgan = require('morgan');
 const dotenv = require('dotenv');
 const connectDB = require('./config/db');
 const errorHandler = require('./middleware/errorHandler');
 dotenv.config();
 connectDB();
 const app = express();
 app.use(cors());
 app.use(express.json());
 app.use(morgan('dev'));
 // Routes
 app.use('/api/auth', require('./routes/auth'));
 app.use('/api/books', require('./routes/books'));
 app.use('/api/orders', require('./routes/orders'));
 // Health
 app.get('/', (req, res) => res.send({ msg: 'Bookstore API running' }));
 // Error handling middleware
 app.use(errorHandler);
 
const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => console.log(`Server running on port ${PORT}`));