// // ...existing code...
// import React, { useContext } from "react";
// import { CartContext } from "../context/CartContext";
// import { AuthContext } from "../context/AuthContext";
// import api from "../api/axios";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const styles = {
//   // ...existing styles...
// };

// const Checkout = () => {
//   const { cart, clearCart } = useContext(CartContext);
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const total = cart.reduce((s, i) => s + (Number(i.book?.price) || 0) * i.qty, 0);

//   const handlePlaceOrder = async () => {
//     try {
//       // normalize id to `bookId` (backend expects bookId in some implementations)
//       const items = cart.map((i) => {
//         const bookId =
//           (i.book && (i.book._id || i.book.id)) ||
//           (typeof i.book === "string" ? i.book : null);
//         return { bookId, qty: i.qty || 1 };
//       });

//       console.log("Order payload items:", items, "cart:", cart);

//       const invalid = items.find((it) => !it.bookId);
//       if (invalid) {
//         toast.error("Invalid book ID: undefined — check CartContext / how items are added");
//         return;
//       }

//       // POST payload matches patched backend helper (accepts bookId)
//       await api.post("/orders", { items, paymentStatus: "unpaid" });

//       toast.success("Order placed!");
//       clearCart();
//       navigate("/");
//     } catch (err) {
//       console.error("Place order error", err, err.response?.data);
//       toast.error(err.response?.data?.message || "Order failed");
//     }
//   };

//   if (!cart.length) {
//     return (
//       <div style={styles.container}>
//         <h2 style={styles.heading}>Checkout</h2>
//         <div style={styles.emptyMessage}>
//           Your cart is empty. <Link to="/books" style={styles.browseLink}>Browse books</Link>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div style={styles.container}>
//         <h2 style={styles.heading}>Checkout</h2>
//         <div style={styles.emptyMessage}>
//           Please <Link to="/login" style={styles.browseLink}>login</Link> to proceed to checkout.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.heading}>Proceed to Checkout</h2>

//       <div style={styles.userInfo}>
//         <div style={styles.sectionTitle}>Shipping To</div>
//         <div style={styles.userName}>{user.name}</div>
//         <div style={styles.userEmail}>{user.email}</div>
//       </div>

//       <div style={styles.sectionTitle}>Order Summary ({cart.length} items)</div>
//       <ul style={styles.itemList}>
//         {cart.map((i) => (
//           <li key={i.book?._id || i.book?.id || i.book} style={styles.item}>
//             <span style={styles.itemDetails}>
//               {i.book?.title || i.book?.name || 'Unknown'} (x{i.qty})
//             </span>
//             <span style={styles.itemPrice}>
//               ₹{((Number(i.book?.price) || 0) * i.qty).toFixed(2)}
//             </span>
//           </li>
//         ))}
//       </ul>

//       <div style={styles.totalSummary}>
//         <div style={styles.totalText}>
//           Total Amount: ₹{total.toFixed(2)}
//         </div>
//       </div>

//       <button onClick={handlePlaceOrder} style={styles.placeOrderButton}>
//         Place Order & Pay Later (Unpaid)
//       </button>
//     </div>
//   );
// };

// export default Checkout;
// // ...existing code...





import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const styles = {
    container: {
        maxWidth: '700px',
        margin: '40px auto',
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px',
        fontSize: '2rem',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '10px',
    },
    sectionTitle: {
        fontSize: '1.2rem',
        color: '#4a90e2',
        borderLeft: '4px solid #4a90e2',
        paddingLeft: '10px',
        marginBottom: '15px',
        fontWeight: '600',
    },
    userInfo: {
        backgroundColor: '#f9f9f9',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '25px',
        border: '1px solid #eee',
    },
    userName: {
        fontSize: '1.1rem',
        fontWeight: '700',
        marginBottom: '5px',
    },
    userEmail: {
        fontSize: '0.95rem',
        color: '#666',
    },
    itemList: {
        listStyle: 'none',
        padding: 0,
        marginBottom: '25px',
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px dotted #ccc',
        fontSize: '1rem',
    },
    itemDetails: {
        fontWeight: '500',
        color: '#333',
    },
    itemPrice: {
        fontWeight: '600',
        color: '#1abc9c',
    },
    totalSummary: {
        textAlign: 'right',
        marginTop: '20px',
        paddingTop: '15px',
        borderTop: '2px solid #4a90e2',
    },
    totalText: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: '#333',
    },
    placeOrderButton: {
        width: '100%',
        padding: '15px',
        marginTop: '30px',
        backgroundColor: '#ff6b6b',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.2rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    emptyMessage: {
        textAlign: 'center',
        padding: '50px 20px',
        fontSize: '1.1rem',
        color: '#666',
    },
    browseLink: {
        color: '#4a90e2',
        textDecoration: 'none',
        fontWeight: '600',
        marginLeft: '5px',
    },
};

const Checkout = () => {

    // FIXED: Correct CartContext reference
    const { cart, clearCart } = useContext(CartContext);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const total = cart.reduce((sum, item) =>
        sum + (Number(item.book?.price) || 0) * item.qty, 0
    );

    const handlePlaceOrder = async () => {
        try {
            const items = cart.map((i) => {
                const bookId =
                    i.book?._id ||
                    i.book?.id ||
                    (typeof i.book === "string" ? i.book : null);

                return { bookId, qty: i.qty };
            });

            // Validate IDs
            const invalid = items.find((it) => !it.bookId);
            if (invalid) {
                toast.error("Invalid book ID found in cart.");
                return;
            }

            await api.post("/orders", {
                items,
                paymentStatus: "unpaid",
            });

            toast.success("Order placed successfully!");
            clearCart();
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Order failed");
            console.error(err);
        }
    };

    if (!cart.length) {
        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>Checkout</h2>
                <div style={styles.emptyMessage}>
                    Your cart is empty.
                    <Link to="/books" style={styles.browseLink}>Browse books</Link>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>Checkout</h2>
                <div style={styles.emptyMessage}>
                    Please
                    <Link to="/login" style={styles.browseLink}>login</Link>
                    to continue.
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Proceed to Checkout</h2>

            <div style={styles.userInfo}>
                <div style={styles.sectionTitle}>Shipping To</div>
                <div style={styles.userName}>{user.name}</div>
                <div style={styles.userEmail}>{user.email}</div>
            </div>

            <div style={styles.sectionTitle}>Order Summary ({cart.length} items)</div>
            <ul style={styles.itemList}>
                {cart.map(i => {
                    const id = i.book?._id || i.book?.id || i.book;
                    return (
                        <li key={id} style={styles.item}>
                            <span style={styles.itemDetails}>
                                {i.book?.title || "Unknown"} (x{i.qty})
                            </span>
                            <span style={styles.itemPrice}>
                                ₹{((Number(i.book?.price) || 0) * i.qty).toFixed(2)}
                            </span>
                        </li>
                    );
                })}
            </ul>

            <div style={styles.totalSummary}>
                <div style={styles.totalText}>Total Amount: ₹{total.toFixed(2)}</div>
            </div>

            <button onClick={handlePlaceOrder} style={styles.placeOrderButton}>
                Place Order & Pay Later
            </button>
        </div>
    );
};

export default Checkout;





// import React, { useContext } from "react";
// import { CartContext } from "../context/CartContext";
// import { AuthContext } from "../context/AuthContext";
// import api from "../api/axios";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const styles = {
//     container: {
//         maxWidth: '700px',
//         margin: '40px auto',
//         padding: '30px',
//         backgroundColor: '#ffffff',
//         borderRadius: '10px',
//         boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
//         fontFamily: 'Arial, sans-serif',
//     },
//     heading: {
//         textAlign: 'center',
//         color: '#333',
//         marginBottom: '30px',
//         fontSize: '2rem',
//         borderBottom: '2px solid #f0f0f0',
//         paddingBottom: '10px',
//     },
//     sectionTitle: {
//         fontSize: '1.2rem',
//         color: '#4a90e2',
//         borderLeft: '4px solid #4a90e2',
//         paddingLeft: '10px',
//         marginBottom: '15px',
//         fontWeight: '600',
//     },
//     userInfo: {
//         backgroundColor: '#f9f9f9',
//         padding: '15px',
//         borderRadius: '8px',
//         marginBottom: '25px',
//         border: '1px solid #eee',
//     },
//     userName: {
//         fontSize: '1.1rem',
//         fontWeight: '700',
//         marginBottom: '5px',
//     },
//     userEmail: {
//         fontSize: '0.95rem',
//         color: '#666',
//     },
//     itemList: {
//         listStyle: 'none',
//         padding: 0,
//         marginBottom: '25px',
//     },
//     item: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         padding: '10px 0',
//         borderBottom: '1px dotted #ccc',
//         fontSize: '1rem',
//     },
//     itemDetails: {
//         fontWeight: '500',
//         color: '#333',
//     },
//     itemPrice: {
//         fontWeight: '600',
//         color: '#1abc9c',
//     },
//     totalSummary: {
//         textAlign: 'right',
//         marginTop: '20px',
//         paddingTop: '15px',
//         borderTop: '2px solid #4a90e2',
//     },
//     totalText: {
//         fontSize: '1.5rem',
//         fontWeight: '800',
//         color: '#333',
//     },
//     placeOrderButton: {
//         width: '100%',
//         padding: '15px',
//         marginTop: '30px',
//         backgroundColor: '#ff6b6b', // Action color for order placement
//         color: 'white',
//         border: 'none',
//         borderRadius: '8px',
//         fontSize: '1.2rem',
//         fontWeight: '700',
//         cursor: 'pointer',
//         transition: 'background-color 0.3s ease',
//     },
//     emptyMessage: {
//         textAlign: 'center',
//         padding: '50px 20px',
//         fontSize: '1.1rem',
//         color: '#666',
//     },
//     browseLink: {
//         color: '#4a90e2',
//         textDecoration: 'none',
//         fontWeight: '600',
//         marginLeft: '5px',
//     },
// };

// const Checkout = () => {
//     const { cart, clearCart } = useContext(CartContext);
//     const { user } = useContext(AuthContext);
//     const navigate = useNavigate();

//     const total = cart.reduce((s, i) => s + i.book.price * i.qty, 0);

//     const handlePlaceOrder = async () => {
//         try {
//             const items = cart.map((i) => ({
//                 book: i.book._id,
//                 qty: i.qty,
//             }));

//             // For simplicity, we are sending unauthenticated request here.
//             // In a real app, this should be authenticated and server should verify price and stock.
//             await api.post("/orders", { items, paymentStatus: "unpaid" });

//             toast.success("Order placed!");
//             clearCart();
//             navigate("/");
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Order failed");
//         }
//     };

//     if (!cart.length) {
//         return (
//             <div style={styles.container}>
//                 <h2 style={styles.heading}>Checkout</h2>
//                 <div style={styles.emptyMessage}>
//                     Your cart is empty. <Link to="/books" style={styles.browseLink}>Browse books</Link>
//                 </div>
//             </div>
//         );
//     }

//     // Fallback for user data safety, though typically handled by AuthProvider
//     if (!user) {
//         return (
//             <div style={styles.container}>
//                 <h2 style={styles.heading}>Checkout</h2>
//                 <div style={styles.emptyMessage}>
//                     Please <Link to="/login" style={styles.browseLink}>login</Link> to proceed to checkout.
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div style={styles.container}>
//             <h2 style={styles.heading}>Proceed to Checkout</h2>

//             <div style={styles.userInfo}>
//                 <div style={styles.sectionTitle}>Shipping To</div>
//                 <div style={styles.userName}>{user.name}</div>
//                 <div style={styles.userEmail}>{user.email}</div>
//                 {/* Real app would include address details here */}
//             </div>

//             <div style={styles.sectionTitle}>Order Summary ({cart.length} items)</div>
//             <ul style={styles.itemList}>
//                 {cart.map((i) => (
//                     <li key={i.book._id} style={styles.item}>
//                         <span style={styles.itemDetails}>
//                             {i.book.title} (x{i.qty})
//                         </span>
//                         <span style={styles.itemPrice}>
//                             ₹{(i.book.price * i.qty).toFixed(2)}
//                         </span>
//                     </li>
//                 ))}
//             </ul>

//             <div style={styles.totalSummary}>
//                 <div style={styles.totalText}>
//                     Total Amount: ₹{total.toFixed(2)}
//                 </div>
//             </div>

//             <button onClick={handlePlaceOrder} style={styles.placeOrderButton}>
//                 Place Order & Pay Later (Unpaid)
//             </button>
//         </div>
//     );
// };

// export default Checkout;


// import React, { useContext } from 'react';
// import { CartContext } from '../context/CartContext';
// import { AuthContext } from '../context/AuthContext';
// import api from '../api/axios';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const Checkout = () => {
//   const { cart, clearCart } = useContext(CartContext);
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handlePlaceOrder = async () => {
//     try {
//       const items = cart.map((i) => ({ book: i.book._id, qty: i.qty }));
//       await api.post('/orders', { items, paymentStatus: 'unpaid' });

//       toast.success('Order placed');
//       clearCart();
//       navigate('/');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Order failed');
//     }
//   };

//   if (!cart.length) return <div>No items to checkout</div>;

//   return (
//     <div>
//       <h2>Checkout</h2>

//       <div>
//         User: {user.name} ({user.email})
//       </div>

//       <div>Items: {cart.length}</div>

//       <button onClick={handlePlaceOrder}>Place Order</button>
//     </div>
//   );
// };

// export default Checkout;
