// import React, { useContext, useState } from 'react';
// import { CartContext } from '../context/CartContext';
// import { Link, useNavigate } from 'react-router-dom';

// const styles = {
//     container: {
//         maxWidth: '900px',
//         margin: '40px auto',
//         padding: '20px',
//         backgroundColor: '#ffffff',
//         borderRadius: '8px',
//         boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//     },
//     heading: {
//         textAlign: 'center',
//         color: '#333',
//         marginBottom: '30px',
//         fontSize: '2rem',
//         borderBottom: '2px solid #eee',
//         paddingBottom: '10px',
//     },
//     emptyCart: {
//         textAlign: 'center',
//         padding: '50px 20px',
//         fontSize: '1.1rem',
//         color: '#666',
//         backgroundColor: '#f9f9f9',
//         borderRadius: '5px',
//         border: '1px dashed #ccc',
//     },
//     browseLink: {
//         color: '#4a90e2',
//         textDecoration: 'none',
//         fontWeight: '600',
//         marginLeft: '5px',
//     },
//     cartList: { listStyle: 'none', padding: 0 },
//     cartItem: {
//         display: 'flex',
//         alignItems: 'center',
//         padding: '15px 0',
//         borderBottom: '1px solid #eee',
//     },
//     itemImage: {
//         width: '60px',
//         height: '80px',
//         objectFit: 'cover',
//         marginRight: '20px',
//         borderRadius: '4px',
//     },
//     uploadBtn: {
//         marginTop: '5px',
//         backgroundColor: '#4a90e2',
//         color: 'white',
//         padding: '4px 8px',
//         border: 'none',
//         borderRadius: '4px',
//         fontSize: '0.8rem',
//         cursor: 'pointer'
//     },
//     itemDetails: {
//         flexGrow: 1,
//         display: 'flex',
//         flexDirection: 'column',
//     },
//     itemTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#333' },
//     itemQtyPrice: {
//         fontSize: '0.95rem',
//         color: '#666',
//         marginTop: '5px',
//     },
//     removeButton: {
//         backgroundColor: '#ff6b6b',
//         color: 'white',
//         border: 'none',
//         padding: '8px 15px',
//         borderRadius: '5px',
//         cursor: 'pointer',
//         fontWeight: '500',
//         fontSize: '0.9rem',
//     },
//     summaryContainer: {
//         borderTop: '2px solid #4a90e2',
//         marginTop: '30px',
//         paddingTop: '20px',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     totalText: { fontSize: '1.5rem', fontWeight: '700', color: '#333' },
//     actionButtons: { display: 'flex', gap: '15px' },
//     checkoutButton: {
//         padding: '12px 25px',
//         backgroundColor: '#4a90e2',
//         color: 'white',
//         border: 'none',
//         borderRadius: '5px',
//         cursor: 'pointer',
//         fontWeight: '600',
//         fontSize: '1rem',
//     },
//     clearButton: {
//         padding: '12px 25px',
//         backgroundColor: '#f1f1f1',
//         color: '#333',
//         border: '1px solid #ccc',
//         borderRadius: '5px',
//         cursor: 'pointer',
//         fontSize: '1rem',
//     }
// };

// const Cart = () => {
//     const { cart, removeFromCart, clearCart } = useContext(CartContext);
//     const navigate = useNavigate();

//     // Local image for each cart item
//     const [images, setImages] = useState({});

//     const handleImageUpload = (e, id) => {
//         const file = e.target.files[0];
//         if (file) {
//             const imageURL = URL.createObjectURL(file);
//             setImages(prev => ({ ...prev, [id]: imageURL }));
//         }
//     };

//     const total = cart.reduce((s, i) => s + i.book.price * i.qty, 0);

//     return (
//         <div style={styles.container}>
//             <h2 style={styles.heading}>Shopping Cart</h2>

//             {cart.length === 0 ? (
//                 <div style={styles.emptyCart}>
//                     Your cart is empty.
//                     <Link to="/books" style={styles.browseLink}>Browse books</Link>
//                 </div>
//             ) : (
//                 <>
//                     <ul style={styles.cartList}>
//                         {cart.map((i) => (
//                             <li key={i.book._id} style={styles.cartItem}>

//                                 {/* Image + Upload Button */}
//                                 <div>
//                                     <img
//                                         src={images[i.book._id] || i.book.imageUrl || "https://placehold.co/60x80?text=Book"}
//                                         alt={i.book.title}
//                                         style={styles.itemImage}
//                                     />

//                                     {/* Upload Input */}
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         id={`upload-${i.book._id}`}
//                                         style={{ display: "none" }}
//                                         onChange={(e) => handleImageUpload(e, i.book._id)}
//                                     />

//                                     <button
//                                         style={styles.uploadBtn}
//                                         onClick={() => document.getElementById(`upload-${i.book._id}`).click()}
//                                     >
//                                         Change Image
//                                     </button>
//                                 </div>

//                                 {/* Details */}
//                                 <div style={styles.itemDetails}>
//                                     <span style={styles.itemTitle}>{i.book.title}</span>
//                                     <span style={styles.itemQtyPrice}>
//                                         Qty: {i.qty} | ₹{(i.book.price * i.qty).toFixed(2)}
//                                     </span>
//                                 </div>

//                                 <button
//                                     onClick={() => removeFromCart(i.book._id)}
//                                     style={styles.removeButton}
//                                 >
//                                     Remove
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>

//                     <div style={styles.summaryContainer}>
//                         <div style={styles.totalText}>
//                             Total: ₹{total.toFixed(2)}
//                         </div>

//                         <div style={styles.actionButtons}>
//                             <button onClick={clearCart} style={styles.clearButton}>Clear Cart</button>
//                             <button
//                                 onClick={() => navigate('/checkout')}
//                                 style={styles.checkoutButton}
//                             >
//                                 Proceed to Checkout
//                             </button>
//                         </div>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default Cart;






import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const styles = {
    container: {
        maxWidth: '900px',
        margin: '40px auto',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px',
        fontSize: '2rem',
        borderBottom: '2px solid #eee',
        paddingBottom: '10px',
    },
    emptyCart: {
        textAlign: 'center',
        padding: '50px 20px',
        fontSize: '1.1rem',
        color: '#666',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
        border: '1px dashed #ccc',
    },
    browseLink: {
        color: '#4a90e2',
        textDecoration: 'none',
        fontWeight: '600',
        marginLeft: '5px',
    },
    cartList: {
        listStyle: 'none',
        padding: 0,
    },
    cartItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '15px 0',
        borderBottom: '1px solid #eee',
    },
    itemImage: {
        width: '60px',
        height: '80px',
        objectFit: 'cover',
        marginRight: '20px',
        borderRadius: '4px',
    },
    itemDetails: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    itemTitle: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#333',
    },
    itemQtyPrice: {
        fontSize: '0.95rem',
        color: '#666',
        marginTop: '5px',
    },
    removeButton: {
        backgroundColor: '#ff6b6b',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '0.9rem',
        transition: 'background-color 0.3s ease',
        marginLeft: '20px',
    },
    summaryContainer: {
        borderTop: '2px solid #4a90e2',
        marginTop: '30px',
        paddingTop: '20px',
        textAlign: 'right',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalText: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#333',
    },
    actionButtons: {
        display: 'flex',
        gap: '15px',
    },
    checkoutButton: {
        padding: '12px 25px',
        backgroundColor: '#4a90e2',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        transition: 'background-color 0.3s ease',
    },
    clearButton: {
        padding: '12px 25px',
        backgroundColor: '#f1f1f1',
        color: '#333',
        border: '1px solid #ccc',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        transition: 'background-color 0.3s ease',
    }
};

const Cart = () => {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const total = cart.reduce((s, i) => s + i.book.price * i.qty, 0);

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Shopping Cart</h2>

            {cart.length === 0 ? (
                <div style={styles.emptyCart}>
                    Your cart is empty.
                    <Link to="/books" style={styles.browseLink}>Browse books</Link>
                </div>
            ) : (
                <>
                    <ul style={styles.cartList}>
                        {cart.map((i) => (
                            <li key={i.book._id} style={styles.cartItem}>
                                <img
                                    src={i.book.imageUrl || 'https://via.placeholder.com/60x80?text=Book'}
                                    alt={i.book.title}
                                    style={styles.itemImage}
                                />

                                <div style={styles.itemDetails}>
                                    <span style={styles.itemTitle}>
                                        {i.book.title}
                                    </span>

                                    <span style={styles.itemQtyPrice}>
                                        Qty: {i.qty} | ₹{(i.book.price * i.qty).toFixed(2)}
                                    </span>
                                </div>

                                <button
                                    onClick={() => removeFromCart(i.book._id)}
                                    style={styles.removeButton}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div style={styles.summaryContainer}>
                        <div style={styles.totalText}>
                            Total: ₹{total.toFixed(2)}
                        </div>

                        <div style={styles.actionButtons}>
                            <button onClick={clearCart} style={styles.clearButton}>
                                Clear Cart
                            </button>

                            <button
                                onClick={() => navigate('/checkout')}
                                style={styles.checkoutButton}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;





















