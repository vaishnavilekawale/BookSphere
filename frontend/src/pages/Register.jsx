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
    registerCard: {
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
        backgroundColor: '#1abc9c', // A friendly green color for success/new accounts
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    loginLinkText: {
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '0.9rem',
        color: '#666',
    },
    loginLink: {
        color: '#4a90e2', // Primary blue for existing account link
        textDecoration: 'none',
        fontWeight: '600',
    }
};

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            toast.success('Registered');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={submit} style={styles.registerCard}>
                <h2 style={styles.heading}>Register</h2>
                
                <input 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    placeholder='Name' 
                    style={styles.input}
                    type='text'
                    required
                />

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
                    style={styles.button}
                >
                    Register
                </button>
                
                <p style={styles.loginLinkText}>
                    Already have an account? <Link to="/login" style={styles.loginLink}>Login here</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;


//  import React, { useState, useContext } from 'react';
//  import { AuthContext } from '../context/AuthContext';
//  import { useNavigate } from 'react-router-dom';
//  import { toast } from 'react-toastify';
//  const Register = () => {
//  23
// const [name, setName] = useState('');
//  const [email, setEmail] = useState('');
//  const [password, setPassword] = useState('');
//  const { register } = useContext(AuthContext);
//  const navigate = useNavigate();
//  const submit = async (e) => {
//  e.preventDefault();
//  try {
//  await register(name, email, password);
//  toast.success('Registered');
//  navigate('/');
//  } catch (err) {
//  toast.error(err.response?.data?.message || 'Registration failed');
//  }
//  };
//  return (
//  <form onSubmit={submit} className='form'>
//  <h2>Register</h2>
//  <input value={name} onChange={e => setName(e.target.value)}
//  placeholder='Name' />
//  <input value={email} onChange={e => setEmail(e.target.value)}
//  placeholder='Email' />
//  <input value={password} onChange={e => setPassword(e.target.value)}
//  placeholder='Password' type='password' />
//  <button type='submit'>Register</button>
//  </form>
//  );
//  };
//  export default Register;