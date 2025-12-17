import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const normalizeBook = (book) => {
  if (!book) return null;
  // if book is a string id
  if (typeof book === "string") return { _id: book };
  // if book has id but not _id
  if (!book._id && book.id) return { ...book, _id: book.id };
  return book;
};

export const CartProvider = ({ children }) => {
  const loadCart = () => {
    try {
      const raw = JSON.parse(localStorage.getItem("cart")) || [];
      // ensure each entry has book as object with _id
      return raw
        .map((i) => {
          const book = normalizeBook(i.book);
          const qty = Number(i.qty) || 1;
          if (!book || !book._id) return null; // drop invalid entries
          return { book, qty };
        })
        .filter(Boolean);
    } catch (e) {
      console.error("Failed to load cart:", e);
      return [];
    }
  };

  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book, qty = 1) => {
    const b = normalizeBook(book);
    if (!b || !b._id) {
      console.error("❌ addToCart: INVALID BOOK or MISSING _id", book);
      return;
    }

    setCart((prev) => {
      const found = prev.find((i) => (i.book._id || i.book.id) === b._id);
      if (found) {
        return prev.map((i) =>
          (i.book._id || i.book.id) === b._id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { book: b, qty }];
    });
  };

  const removeFromCart = (bookId) =>
    setCart((prev) => prev.filter((i) => (i.book._id || i.book.id) !== bookId));

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};




// // src/context/CartContext.jsx
// import React, { createContext, useState, useEffect } from "react";

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState(() =>
//     JSON.parse(localStorage.getItem("cart")) || []
//   );

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   const addToCart = (book, qty = 1) => {
//     if (!book._id) {
//       console.error("❌ INVALID BOOK ID:", book);
//       return;
//     }

//     setCart((prev) => {
//       const found = prev.find((i) => i.book._id === book._id);

//       if (found) {
//         return prev.map((i) =>
//           i.book._id === book._id ? { ...i, qty: i.qty + qty } : i
//         );
//       }

//       return [...prev, { book, qty }];
//     });
//   };

//   const removeFromCart = (bookId) =>
//     setCart((prev) => prev.filter((i) => i.book._id !== bookId));

//   const clearCart = () => setCart([]);

//   return (
//     <CartContext.Provider
//       value={{ cart, addToCart, removeFromCart, clearCart }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

//  import React, { createContext, useState, useEffect } from 'react';
//  export const CartContext = createContext();
//  export const CartProvider = ({ children }) => {
//  const [cart, setCart] = useState(() =>
//  JSON.parse(localStorage.getItem('cart')) || []);
//  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); },
//  [cart]);
//  const addToCart = (book, qty = 1) => {
//  setCart(prev => {
//  const found = prev.find(i => i.book._id === book._id);
//  if (found) return prev.map(i => i.book._id === book._id ? { ...i, qty:
//  i.qty + qty } : i);
//  return [...prev, { book, qty }];
//  });
//  };
 
// const removeFromCart = (bookId) => setCart(prev => prev.filter(i =>
//  i.book._id !== bookId));
//  const clearCart = () => setCart([]);
//  return <CartContext.Provider value={{ cart, addToCart, removeFromCart,clearCart }}>{children}</CartContext.Provider>;
//  };