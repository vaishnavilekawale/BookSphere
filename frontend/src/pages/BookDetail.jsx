import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/books/${id}`);
      setBook(data);
    })();
  }, [id]);

  if (!book) return <div>Loading...</div>;

  return (
    <div className="book-detail">
      <img
        src={book.imageUrl || "https://via.placeholder.com/300"}
        alt={book.title}
      />

      <div>
        <h2>{book.title}</h2>
        <p>By {book.author}</p>
        <p>{book.description}</p>
        <strong>₹{book.price}</strong>

        <div>
          <button onClick={() => addToCart(book, 1)}>Add to cart</button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;


// import React, { useEffect, useState, useContext } from 'react';
// import { useParams } from 'react-router-dom';
// import api from '../api/axios';
// import { CartContext } from '../context/CartContext';

// const BookDetail = () => {
//   const { id } = useParams();
//   const [book, setBook] = useState(null);
//   const { addToCart } = useContext(CartContext);

//   useEffect(() => {
//     (async () => {
//       const { data } = await api.get(`/books/${id}`);
//       setBook(data);
//     })();
//   }, [id]);

//   if (!book) return <div>Loading...</div>;

//   return (
//     <div className="book-detail">
//       <img
//         src={book.imageUrl || 'https://via.placeholder.com/300'}
//         alt={book.title}
//       />

//       <div>
//         <h2>{book.title}</h2>
//         <p>By {book.author}</p>
//         <p>{book.description}</p>

//         <strong>₹{book.price}</strong>

//         <div>
//           <button onClick={() => addToCart(book, 1)}>Add to cart</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookDetail;
