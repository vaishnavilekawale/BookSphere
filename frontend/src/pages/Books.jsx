import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

// ===========================
// BookCard Component
// ===========================

const cardStyles = {
    bookCard: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        textAlign: 'center',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
        backgroundColor: 'white',
        transition: 'transform 0.2s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    bookImage: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '4px',
        marginBottom: '10px',
    },
    bookTitle: {
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#333',
        marginBottom: '5px',
    },
    bookAuthor: {
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '10px',
    },
    bookPrice: {
        fontSize: '1.2rem',
        fontWeight: '800',
        color: '#1abc9c',
        marginBottom: '15px',
    },
    addButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#4a90e2',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '600',
    }
};

const BookCard = ({ book, onAdd }) => {
    const handleAddToCart = () => {
        onAdd();
        toast.success(`${book.title} added to cart!`, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
        });
    };

    return (
        <div style={cardStyles.bookCard}>
            <img
                src={book.imageUrl || 'https://via.placeholder.com/250x350?text=Book+Cover'}
                alt={book.title}
                style={cardStyles.bookImage}
            />
            <h3 style={cardStyles.bookTitle}>{book.title}</h3>
            <p style={cardStyles.bookAuthor}>By: {book.author}</p>
            <div style={cardStyles.bookPrice}>₹{book.price?.toFixed(2)}</div>
            <button onClick={handleAddToCart} style={cardStyles.addButton}>
                Add to Cart
            </button>
        </div>
    );
};

// ===========================
// Books Component
// ===========================

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '0 20px',
    },
    searchControls: {
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        alignItems: 'center',
    },
    searchInput: {
        flexGrow: 1,
        padding: '10px 15px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '1rem',
        maxWidth: '400px',
    },
    searchButton: {
        padding: '10px 20px',
        backgroundColor: '#4a90e2',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
    },
    bookGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '25px',
    },
    paginationContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '40px',
        gap: '15px',
    },
    paginationButton: {
        padding: '10px 15px',
        backgroundColor: '#f1f1f1',
        color: '#333',
        border: '1px solid #ddd',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    paginationButtonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    pageInfo: {
        fontSize: '1rem',
        color: '#666',
        fontWeight: '500',
    }
};

const Books = () => {
    const [books, setBooks] = useState([]);
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { addToCart } = useContext(CartContext);

    const normalizeBooks = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (data.books && Array.isArray(data.books)) return data.books;
        if (Array.isArray(data.data)) return data.data;
        return [];
    };

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/books");
                const bookData = normalizeBooks(res.data);
                setBooks(bookData);
            } catch (err) {
                console.error("Failed to fetch books", err);
            }
        })();
    }, []);

    // Search (Client side)
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(q.toLowerCase()) ||
        book.author.toLowerCase().includes(q.toLowerCase())
    );

    const prevButtonStyles =
        page <= 1
            ? { ...styles.paginationButton, ...styles.paginationButtonDisabled }
            : styles.paginationButton;

    const nextButtonStyles =
        page >= totalPages
            ? { ...styles.paginationButton, ...styles.paginationButtonDisabled }
            : styles.paginationButton;

    return (
        <div style={styles.container}>
            <div style={styles.searchControls}>
                <input
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder='Search title or author'
                    style={styles.searchInput}
                />
                <button onClick={() => setPage(1)} style={styles.searchButton}>
                    Search
                </button>
            </div>

            <div style={styles.bookGrid}>
                {filteredBooks.map(b => (
                    <BookCard key={b._id} book={b} onAdd={() => addToCart(b, 1)} />
                ))}
            </div>

            <div style={styles.paginationContainer}>
                <button
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    style={prevButtonStyles}
                >
                    Prev
                </button>

                <span style={styles.pageInfo}>Page {page} / {totalPages}</span>

                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    style={nextButtonStyles}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Books;








//  import React, { useEffect, useState, useContext } from 'react';
//  import api from '../api/axios';
//  import BookCard from '../components/BookCard';
//  import { CartContext } from '../context/CartContext';
//  const Books = () => {
//  const [books, setBooks] = useState([]);
//  const [q, setQ] = useState('');
//  const [page, setPage] = useState(1);
//  const [totalPages, setTotalPages] = useState(1);
//  const { addToCart } = useContext(CartContext);
//  const fetch = async () => {
//  const { data } = await api.get(`/books?q=${encodeURIComponent(q)}&page=$
//  {page}&limit=12`);
//  setBooks(data.books);
//  setTotalPages(data.totalPages);
//  };
//  useEffect(() => { fetch(); }, [q, page]);
//  return (
//  <div>
//  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
//  <input value={q} onChange={e => setQ(e.target.value)}
//  placeholder='Search title or author' />
//  <button onClick={() => { setPage(1); fetch(); }}>Search</button>
 
// </div>
//  <div className='grid'>
//  {books.map(b => <BookCard key={b._id} book={b} onAdd={() => addToCart(b,
//  1)} />)}
//  </div>
//  <div style={{ marginTop: '12px' }}>
//  <button disabled={page<=1} onClick={() => setPage(p => p-1)}>Prev</
//  button>
//  <span> Page {page} / {totalPages} </span>
//  <button disabled={page>=totalPages} onClick={() => setPage(p => p+1)}
//  >Next</button>
//  </div>
//  </div>
//  );
//  };
//  export default Books;