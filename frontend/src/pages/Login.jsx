import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f7f6',
        padding: '20px',
    },
    loginCard: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    heading: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px',
        fontSize: '2rem',
        fontWeight: '600',
    },
    input: {
        width: 'calc(100% - 20px)',
        padding: '12px 10px',
        margin: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '1rem',
        transition: 'border-color 0.3s ease',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '12px',
        marginTop: '20px',
        backgroundColor: '#4a90e2',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    registerLinkText: {
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '0.9rem',
        color: '#666',
    },
    registerLink: {
        color: '#4a90e2',
        textDecoration: 'none',
        fontWeight: '600',
    }
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await login(email, password); // login returns { token, user }
            toast.success('Logged in');

            // determine role (use returned user or localStorage fallback)
            const returnedUser = result?.user || (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
            const role = (returnedUser?.role || '').toString().toLowerCase();

            if (role === 'admin') navigate('/admin');
            else navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={submit} style={styles.loginCard}>
                <h2 style={styles.heading}>Login</h2>

                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder='Email'
                    style={styles.input}
                    type='email'
                    required
                />

                <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder='Password'
                    type='password'
                    style={styles.input}
                    required
                />

                <button
                    type='submit'
                    style={{ ...styles.button, opacity: loading ? 0.8 : 1, cursor: loading ? 'wait' : 'pointer' }}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p style={styles.registerLinkText}>
                    New user? <Link to="/register" style={styles.registerLink}>Register here</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
















// import React, { useState, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { useNavigate, Link } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const styles = {
//     container: {
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         minHeight: '100vh',
//         backgroundColor: '#f4f7f6', // Light gray background
//         padding: '20px',
//     },
//     loginCard: {
//         backgroundColor: '#ffffff',
//         padding: '40px',
//         borderRadius: '10px',
//         boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // Soft shadow
//         width: '100%',
//         maxWidth: '400px', // Max width for card
//     },
//     heading: {
//         textAlign: 'center',
//         color: '#333',
//         marginBottom: '30px',
//         fontSize: '2rem',
//         fontWeight: '600',
//     },
//     input: {
//         width: 'calc(100% - 20px)',
//         padding: '12px 10px',
//         margin: '10px 0',
//         border: '1px solid #ccc',
//         borderRadius: '5px',
//         fontSize: '1rem',
//         transition: 'border-color 0.3s ease',
//         boxSizing: 'border-box',
//     },
//     button: {
//         width: '100%',
//         padding: '12px',
//         marginTop: '20px',
//         backgroundColor: '#4a90e2', // Primary blue
//         color: 'white',
//         border: 'none',
//         borderRadius: '5px',
//         fontSize: '1.1rem',
//         fontWeight: '600',
//         cursor: 'pointer',
//         transition: 'background-color 0.3s ease',
//     },
//     registerLinkText: {
//         textAlign: 'center',
//         marginTop: '20px',
//         fontSize: '0.9rem',
//         color: '#666',
//     },
//     registerLink: {
//         color: '#4a90e2',
//         textDecoration: 'none',
//         fontWeight: '600',
//     }
// };

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const { login } = useContext(AuthContext);
//     const navigate = useNavigate();

//     const submit = async (e) => {
//         e.preventDefault();
//         try {
//             await login(email, password);
//             toast.success('Logged in');
//             navigate('/');
//         } catch (err) {
//             toast.error(err.response?.data?.message || 'Login failed');
//         }
//     };

//     return (
//         <div style={styles.container}>
//             <form onSubmit={submit} style={styles.loginCard}>
//                 <h2 style={styles.heading}>Login</h2>
                
//                 <input 
//                     value={email} 
//                     onChange={e => setEmail(e.target.value)}
//                     placeholder='Email' 
//                     style={styles.input}
//                     type='email'
//                     required
//                 />
                
//                 <input 
//                     value={password} 
//                     onChange={e => setPassword(e.target.value)}
//                     placeholder='Password' 
//                     type='password'
//                     style={styles.input}
//                     required
//                 />
                
//                 <button 
//                     type='submit' 
//                     style={styles.button}
//                 >
//                     Login
//                 </button>
                
//                 <p style={styles.registerLinkText}>
//                     New user? <Link to="/register" style={styles.registerLink}>Register here</Link>
//                 </p>
//             </form>
//         </div>
//     );
// };

// export default Login;


//  import React, { useState, useContext } from 'react';
//  import { AuthContext } from '../context/AuthContext';
//  import { useNavigate } from 'react-router-dom';
//  import { toast } from 'react-toastify';
//  const Login = () => {
//  const [email, setEmail] = useState('');
//  const [password, setPassword] = useState('');
//  const { login } = useContext(AuthContext);
//  const navigate = useNavigate();
//  const submit = async (e) => {
//  e.preventDefault();
//  try {
//  await login(email, password);
//  toast.success('Logged in');
//  navigate('/');
//  } catch (err) {
//  toast.error(err.response?.data?.message || 'Login failed');
//  }
//  };
//  return (
//  <form onSubmit={submit} className='form'>
//  <h2>Login</h2>
//  <input value={email} onChange={e => setEmail(e.target.value)}
//  placeholder='Email' />
//  <input value={password} onChange={e => setPassword(e.target.value)}
//  placeholder='Password' type='password' />
//  <button type='submit'>Login</button>
//  </form>
//  );
//  };
//  export default Login;