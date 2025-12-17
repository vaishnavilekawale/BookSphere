import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

// ===================================
// 1. CSS Styles as JavaScript Object
// ===================================
const styles = {
    // Primary Colors
    primaryBlue: '#4a90e2',
    secondaryRed: '#ff6b6b',
    
    // Header Container
    navbarContainer: {
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '10px 0',
    },
    headerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
    },
    
    // Logo
    navbarLogo: {
        color: '#4a90e2',
        fontSize: '1.8rem',
        fontWeight: '700',
        textDecoration: 'none',
        letterSpacing: '-0.5px',
    },
    
    // Navigation Links Group
    navbarLinks: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    
    // Auth Controls Group
    authControls: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '25px',
        gap: '10px',
    },
    
    // General Link/Item Style
    navItem: {
        color: '#333',
        textDecoration: 'none',
        fontWeight: '500',
        padding: '5px 0',
        transition: 'color 0.3s ease',
    },

    // Cart Link Specific
    cartLink: {
        position: 'relative',
        color: '#333',
        textDecoration: 'none',
        fontWeight: '500',
    },
    
    // Cart Badge
    cartBadge: {
        backgroundColor: '#ff6b6b',
        color: 'white',
        fontSize: '0.75rem',
        padding: '3px 7px',
        borderRadius: '50%',
        position: 'absolute',
        top: '-8px',
        right: '-15px',
        fontWeight: '600',
    },

    // User Greeting
    userGreeting: {
        color: '#666',
        fontSize: '0.95rem',
        marginRight: '5px',
    },

    // Admin Link (Styled as a small button)
    adminLink: {
        color: '#1abc9c',
        border: '1px solid #1abc9c',
        padding: '5px 10px',
        borderRadius: '4px',
        textDecoration: 'none',
        transition: 'background-color 0.3s',
        fontWeight: '600',
    },

    // Login Button (Outlined Style)
    loginBtn: {
        color: '#4a90e2',
        border: '1px solid #4a90e2',
        padding: '8px 15px',
        borderRadius: '4px',
        fontWeight: '600',
        textDecoration: 'none',
        transition: 'all 0.3s',
    },

    // Register Button (Solid Primary Style)
    registerBtn: {
        backgroundColor: '#4a90e2',
        color: 'white',
        padding: '8px 15px',
        borderRadius: '4px',
        fontWeight: '600',
        textDecoration: 'none',
        transition: 'background-color 0.3s',
    },

    // Logout Button (Simple Button Style)
    logoutButton: {
        backgroundColor: '#f1f1f1',
        color: '#333',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'background-color 0.3s',
    },
    
    // NOTE: React does not easily support :hover using inline styles.
    // For hover effects, you would typically use an external CSS file or a library like Styled Components.
    // For simplicity here, hover is omitted.
};

// ===================================
// 2. Header Component Implementation
// ===================================
const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();

    return (
        <header style={styles.navbarContainer}>
            <div style={styles.headerContent}>
                {/* Logo */}
                <Link to="/" style={styles.navbarLogo}>Bookstore</Link>

                <nav style={styles.navbarLinks}>
                    {/* Main Navigation Links */}
                    <Link to="/books" style={styles.navItem}>Books</Link>
                    
                    {/* Cart Link with Badge */}
                    <Link to="/cart" style={styles.cartLink}>
                        Cart 
                        {/* Cart Count Badge */}
                        <span style={styles.cartBadge}>{cart.length}</span>
                    </Link>

                    {/* Conditional Rendering: Logged In vs Logged Out */}
                    <div style={styles.authControls}>
                        {user ? (
                            <>
                                <span style={styles.userGreeting}>Hi, {user.name}</span>

                                {user.role === 'admin' && (
                                    <Link to="/admin" style={styles.adminLink}>Admin</Link>
                                )}

                                <button
                                    style={styles.logoutButton}
                                    onClick={() => {
                                        logout();
                                        navigate('/');
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Login Button */}
                                <Link to="/login" style={styles.loginBtn}>Login</Link>
                                {/* Register Button */}
                                <Link to="/register" style={styles.registerBtn}>Register</Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;


// import React, { useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { CartContext } from '../context/CartContext';

// const Header = () => {
//   const { user, logout } = useContext(AuthContext);
//   const { cart } = useContext(CartContext);
//   const navigate = useNavigate();

//   return (
//     <header className="site-header">
//       <div className="container">
//         <Link to="/" className="logo">Bookstore</Link>

//         <nav>
//           <Link to="/books">Books</Link>
//           <Link to="/cart">Cart ({cart.length})</Link>

//           {user ? (
//             <>
//               <span>Hi, {user.name}</span>
//               <button
//                 onClick={() => {
//                   logout();
//                   navigate('/');
//                 }}
//               >
//                 Logout
//               </button>

//               {user.role === 'admin' && (
//                 <Link to="/admin">Admin</Link>
//               )}
//             </>
//           ) : (
//             <>
//               <Link to="/login">Login</Link>
//               <Link to="/register">Register</Link>
//             </>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;
