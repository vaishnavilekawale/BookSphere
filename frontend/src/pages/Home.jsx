import React from 'react';
import { Link } from 'react-router-dom';
import HomeImg from "../assets/books.jpg";

const styles = {
  page: {
    padding: '40px',
    fontFamily:
      'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',

    // Background
    background: '#f8f9fa',
   
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',

    // Text color should be defined ONCE
    color: '#ffffff',
    textShadow: '0 2px 4px rgba(0,0,0,0.7)',
  },

  hero: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 24,
    maxWidth: '800px',
    padding: '40px 20px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },

  heroLeft: {
    flex: '1 1 320px',
    marginBottom: '20px',
  },

  title: {
    fontSize: '48px',
    margin: 0,
    color: '#0b5cff',
    fontWeight: 800,
    letterSpacing: '-1px',
  },

  subtitle: {
    marginTop: 12,
    color: '#555',
    lineHeight: 1.5,
    fontSize: '18px',
    textShadow: 'none',
  },

  heroActions: {
    display: 'flex',
    gap: 15,
    alignItems: 'center',
    marginTop: '20px',
  },

  btnPrimary: {
    background: '#0b5cff',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: 8,
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '16px',
    transition: 'background 0.3s ease',
  },
};

const Home = () => {
  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroLeft}>
          <h1 style={styles.title}>📚 Your Next Great Read Awaits</h1>

          <div style={styles.subtitle}>
            Explore our curated collection of fiction, non-fiction, science, and
            history. Find your next favorite book today!
          </div>
        </div>

        <div style={styles.heroActions}>
          <Link to="/books" style={styles.btnPrimary}>
            Browse All Books
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;





// ...existing code...


//  import React, { useEffect, useState } from 'react';
//  import api from '../api/axios';
//  import BookCard from '../components/BookCard';
//  import { useContext } from 'react';
//  import { CartContext } from '../context/CartContext';
//  const Home = () => {
//  const [featured, setFeatured] = useState([]);
//  const { addToCart } = useContext(CartContext);
//  useEffect(() => {
//  (async () => {
//  const { data } = await api.get('/books?limit=6');

// setFeatured(data.books || []);
//  })();
//  }, []);
//  return (
//  <div>
//  <h2>Featured Books</h2>
//  <div className='grid'>
//  {featured.map(b => <BookCard key={b._id} book={b} onAdd={() =>
//  addToCart(b, 1)} />)}
//  </div>
//  </div>
//  );
//  };
//  export default Home;