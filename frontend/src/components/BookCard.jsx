import React from "react";
import { Link } from "react-router-dom";

const BookCard = ({ book, onAdd }) => (
  <div className="book-card">
    <Link to={`/books/${book._id}`}>
      <img
        src={book.imageUrl || "https://via.placeholder.com/150"}
        alt={book.title}
      />
      <h4>{book.title}</h4>
      <p>{book.author}</p>
    </Link>

    <div className="card-footer">
      <strong>₹{book.price}</strong>
      <button onClick={() => onAdd(book)}>Add</button>
    </div>
  </div>
);

export default BookCard;

// import React from 'react';
// import { Link } from 'react-router-dom';

// const BookCard = ({ book, onAdd }) => (
//   <div className='book-card'>
//     <Link to={`/books/${book._id}`}>
//       <img
//         src={book.imageUrl || 'https://via.placeholder.com/150'}
//         alt={book.title}
//       />
//       <h4>{book.title}</h4>
//       <p>{book.author}</p>
//     </Link>

//     <div className='card-footer'>
//       <strong>₹{book.price}</strong>
//       <button onClick={() => onAdd(book)}>Add</button>
//     </div>
//   </div>
// );

// export default BookCard;
