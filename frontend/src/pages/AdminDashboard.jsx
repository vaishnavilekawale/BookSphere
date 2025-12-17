
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const normalizeOrders = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.orders && Array.isArray(data.orders)) return data.orders;
    return [];
  };

  const normalizeBooks = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.books && Array.isArray(data.books)) return data.books;
    return [];
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      if (!user || user.role !== "admin") {
        navigate("/login");
        return;
      }

      const [orderRes, bookRes] = await Promise.all([
        api.get("/orders"),
        api.get("/books"),
      ]);

      setOrders(normalizeOrders(orderRes.data));
      setBooks(normalizeBooks(bookRes.data));

    } catch (err) {
      alert(err.response?.data?.message || "Failed to load admin data");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change status");
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      {/* BOOK CREATE BUTTON */}
      <button
        style={{ marginBottom: 20, padding: "8px 12px" }}
        onClick={async () => {
          const title = prompt("Book title?");
          if (!title) return;

          const author = prompt("Author?", "Unknown");
          const price = Number(prompt("Price?", "100"));
          const stock = Number(prompt("Stock?", "10"));
          const genre = prompt("Genre?", "General");

          try {
            await api.post("/books", { title, author, price, stock, genre });
            alert("Book created");
            fetchData();
          } catch (err) {
            alert("Failed to create book");
          }
        }}
      >
        + Create Book
      </button>

      {/* LAYOUT FIX */}
      <div style={{ display: "flex", gap: 30 }}>

        {/* LEFT → ORDERS */}
        <div style={{ flex: 1 }}>
          <h3>Orders</h3>

          {orders.length === 0 ? (
            <div>No Orders</div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {orders.map((o) => (
                <li key={o._id} style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
                  <b>{o.user?.email || "Customer"}</b>
                  <div>
                    {o._id} • <b>{o.status}</b>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <button onClick={() => changeStatus(o._id, "pending")}>Pending</button>
                    <button onClick={() => changeStatus(o._id, "processing")} style={{ marginLeft: 8 }}>Processing</button>
                    <button onClick={() => changeStatus(o._id, "shipped")} style={{ marginLeft: 8 }}>Shipped</button>
                    <button onClick={() => changeStatus(o._id, "delivered")} style={{ marginLeft: 8 }}>Delivered</button>
                    <button onClick={() => changeStatus(o._id, "cancelled")} style={{ marginLeft: 8, background: "red", color: "white" }}>Cancel</button>
                  </div>

                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT → BOOKS */}
        <div style={{ width: 350, background: "#fafafa", padding: 12, borderLeft: "2px solid #ddd" }}>
          <h3>Books</h3>

          {books.length === 0 ? (
            <div>No Books Found</div>
          ) : (
            books.map((b) => (
              <div
                key={b._id}
                style={{
                  padding: 12,
                  marginBottom: 10,
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  background: "white",
                }}
              >
                <b>{b.title}</b>
                <div>{b.author}</div>
                <div>Genre: {b.genre}</div>
                <div>Price: ₹{b.price}</div>
                <div>Stock: {b.stock}</div>

                {/* UPDATE BUTTON */}
                <button
                  style={{
                    marginTop: 8,
                    padding: "4px 8px",
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                  onClick={async () => {
                    const title = prompt("New Title:", b.title);
                    if (!title) return;

                    const author = prompt("New Author:", b.author);
                    const price = Number(prompt("New Price:", b.price));
                    const stock = Number(prompt("New Stock:", b.stock));
                    const genre = prompt("New Genre:", b.genre);

                    try {
                      await api.put(`/books/${b._id}`, {
                        title,
                        author,
                        price,
                        stock,
                        genre,
                      });
                      alert("Book Updated");
                      fetchData();
                    } catch (err) {
                      alert("Failed to update book");
                    }
                  }}
                >
                  ✏ Edit
                </button>

                {/* DELETE BUTTON */}
                <button
                  style={{
                    marginTop: 8,
                    marginLeft: 8,
                    padding: "4px 8px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                  onClick={async () => {
                    if (!window.confirm("Delete this book?")) return;
                    try {
                      await api.delete(`/books/${b._id}`);
                      alert("Book deleted");
                      fetchData();
                    } catch (err) {
                      alert("Failed to delete book");
                    }
                  }}
                >
                  🗑 Delete
                </button>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;








// import React, { useEffect, useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../api/axios';
// import { AuthContext } from '../context/AuthContext';

// const AdminDashboard = () => {
//   const [orders, setOrders] = useState([]);
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // Correct normalizers
//   const normalizeOrders = (data) => {
//     if (!data) return [];
//     if (Array.isArray(data)) return data;
//     if (data.orders && Array.isArray(data.orders)) return data.orders;
//     return [];
//   };

//   const normalizeBooks = (data) => {
//     if (!data) return [];
//     if (Array.isArray(data)) return data;
//     if (data.books && Array.isArray(data.books)) return data.books;
//     return [];
//   };

//   const fetchData = async () => {
//     setLoading(true);

//     try {
//       if (!user || user.role !== "admin") {
//         navigate("/login");
//         return;
//       }

//       const [orderRes, bookRes] = await Promise.all([
//         api.get("/orders"),
//         api.get("/books"),
//       ]);

//       console.log("Orders Response:", orderRes.data);
//       console.log("Books Response:", bookRes.data);

//       setOrders(normalizeOrders(orderRes.data));
//       setBooks(normalizeBooks(bookRes.data));

//     } catch (err) {
//       console.error("Admin Fetch Error:", err);
//       alert(err.response?.data?.message || "Failed to load admin data");
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const changeStatus = async (id, status) => {
//     try {
//       await api.put(`/orders/${id}/status`, { status });
//       fetchData();
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to change status");
//     }
//   };

//   if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Admin Dashboard</h2>

//       {/* BOOK CREATE BUTTON */}
//       <button
//         style={{ marginBottom: 20, padding: "8px 12px" }}
//         onClick={async () => {
//           const title = prompt("Book title?");
//           if (!title) return;

//           const author = prompt("Author?", "Unknown");
//           const price = Number(prompt("Price?", "100"));
//           const stock = Number(prompt("Stock?", "10"));
//           const genre = prompt("Genre?", "General");

//           try {
//             await api.post("/books", { title, author, price, stock, genre });
//             alert("Book created");
//             fetchData();
//           } catch (err) {
//             alert("Failed to create book");
//           }
//         }}
//       >
//         + Create Book
//       </button>

//       {/* LAYOUT FIX */}
//       <div style={{ display: "flex", gap: 30 }}>

//         {/* LEFT → ORDERS */}
//         <div style={{ flex: 1 }}>
//           <h3>Orders</h3>

//           {orders.length === 0 ? (
//             <div>No Orders</div>
//           ) : (
//             <ul style={{ listStyle: "none", padding: 0 }}>
//               {orders.map((o) => (
//                 <li key={o._id} style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
//                   <b>{o.user?.email || "Customer"}</b>
//                   <div>
//                     {o._id} • <b>{o.status}</b>
//                   </div>

//                   {/* Status Buttons */}
//                   <div style={{ marginTop: 8 }}>
//                     <button onClick={() => changeStatus(o._id, "pending")}>Pending</button>
//                     <button onClick={() => changeStatus(o._id, "processing")} style={{ marginLeft: 8 }}>Processing</button>
//                     <button onClick={() => changeStatus(o._id, "shipped")} style={{ marginLeft: 8 }}>Shipped</button>
//                     <button onClick={() => changeStatus(o._id, "delivered")} style={{ marginLeft: 8 }}>Delivered</button>
//                     <button onClick={() => changeStatus(o._id, "cancelled")} style={{ marginLeft: 8, background: "red", color: "white" }}>Cancel</button>
//                   </div>

//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* RIGHT → BOOKS */}
//         <div style={{ width: 350, background: "#fafafa", padding: 12, borderLeft: "2px solid #ddd" }}>
//           <h3>Books</h3>
//           {books.length === 0 ? (
//             <div>No Books Found</div>
//           ) : (
//             books.map((b) => (
//               <div
//                 key={b._id}
//                 style={{
//                   padding: 12,
//                   marginBottom: 10,
//                   border: "1px solid #ddd",
//                   borderRadius: 6,
//                   background: "white",
//                 }}
//               >
//                 <b>{b.title}</b>
//                 <div>{b.author}</div>
//                 <div>Genre: {b.genre}</div>
//                 <div>Price: ₹{b.price}</div>
//                 <div>Stock: {b.stock}</div>
//               </div>
//             ))
//           )}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

















// import React, { useEffect, useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../api/axios';
// import { AuthContext } from '../context/AuthContext';

// const AdminDashboard = () => {
//   const [orders, setOrders] = useState([]);
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const normalizeOrders = (data) => {
//     if (!data) return [];
//     if (Array.isArray(data)) return data;
//     if (data.orders && Array.isArray(data.orders)) return data.orders;
//     if (data.items && Array.isArray(data.items)) return data.items;
//     return Array.isArray(data.data) ? data.data : [];
//   };

//   const normalizeBooks = (data) => {
//     if (!data) return [];
//     if (Array.isArray(data)) return data;
//     if (data.books && Array.isArray(data.books)) return data.books;
//     if (data.items && Array.isArray(data.items)) return data.items;
//     if (Array.isArray(data.data)) return data.data;
//     return [];
//   };

//   const fetch = async () => {
//     setLoading(true);
//     try {
//       if (!user || (user.role || '').toString().toLowerCase() !== 'admin') {
//         navigate('/login');
//         return;
//       }

//       const [oRes, bRes] = await Promise.all([
//         api.get('/orders'),
//         api.get('/books', { params: { limit: 50 } })
//       ]);

//       setOrders(normalizeOrders(oRes?.data));
//       setBooks(normalizeBooks(bRes?.data));
//     } catch (err) {
//       if (err.response && (err.response.status === 401 || err.response.status === 403)) {
//         navigate('/login');
//         return;
//       }
//       console.error('Admin fetch error', err);
//       alert(err.response?.data?.message || err.message || 'Failed to load admin data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetch(); /* eslint-disable-next-line */ }, []);

//   const changeStatus = async (id, statusLabel) => {
//     try {
//       // normalize and map UI labels to backend enum values
//       const label = String(statusLabel || '').trim().toLowerCase();
//       const map = {
//         processing: 'processing',
//         process: 'processing',
//         'in-progress': 'processing',
//         complete: 'delivered',
//         completed: 'delivered',
//         delivered: 'delivered',
//         shipped: 'shipped',
//         cancel: 'cancelled',
//         cancelled: 'cancelled',
//         pending: 'pending'
//       };
//       const status = map[label] || label; // fallback to lowercase label

//       await api.put(`/orders/${id}/status`, { status });
//       await fetch();
//     } catch (err) {
//       console.error('Status change failed', err);
//       alert(err.response?.data?.message || 'Failed to change status');
//     }
//   };

//   const createBook = async () => {
//     const title = (prompt('Title') || '').trim();
//     if (!title) return;
//     const author = (prompt('Author') || 'Unknown').trim();
//     const priceRaw = prompt('Price (number)', '100');
//     const stockRaw = prompt('Stock (integer)', '10');
//     const genre = (prompt('Genre', 'General') || 'General').trim();

//     const price = parseFloat(priceRaw);
//     const stock = parseInt(stockRaw, 10);

//     if (Number.isNaN(price) || Number.isNaN(stock)) {
//       alert('Price and Stock must be valid numbers');
//       return;
//     }

//     try {
//       const res = await api.post('/books', { title, author, price, stock, genre });
//       console.log('Create book response:', res.data);
//       await fetch();
//       alert('Book created successfully');
//     } catch (err) {
//       console.error('Create book failed', err, err.response?.data);
//       const server = err.response?.data || err.message;
//       alert('Failed to create book: ' + (server?.message || JSON.stringify(server)));
//     }
//   };

//   if (loading) return <div style={{ padding: 20 }}>Loading admin data...</div>;

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Admin Dashboard</h2>

//       <div style={{ marginBottom: 12 }}>
//         <button onClick={createBook} style={{ padding: '8px 12px', borderRadius: 6 }}>Create Book</button>
//       </div>

//       <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
//         <section style={{ flex: 1, minWidth: 320 }}>
//           <h3>Orders</h3>
//           {orders.length === 0 ? <div>No orders</div> : (
//             <ul style={{ padding: 0, listStyle: 'none' }}>
//               {orders.map(o => (
//                 <li key={o._id || o.id} style={{ padding: 10, borderBottom: '1px solid #eee' }}>
//                   <div style={{ fontWeight: 700 }}>{o.user?.email || o.user?.name || 'Customer'}</div>
//                   <div style={{ fontSize: 13, color: '#666' }}>{o._id || o.id} · {o.status || o.orderStatus}</div>
//                   <div style={{ marginTop: 6 }}>
//                     <button onClick={() => changeStatus(o._id || o.id, 'processing')} style={{ marginRight: 8 }}>Processing</button>
//                     <button onClick={() => changeStatus(o._id || o.id, 'delivered')}>Complete</button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </section>

//         <aside style={{ width: 420 }}>
//           <h3>Books</h3>
//           {books.length === 0 ? <div>No books</div> : (
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
//               {books.map(b => (
//                 <div key={b._id || b.id} style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, background: '#fff' }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
//                     <div>
//                       <div style={{ fontWeight: 700 }}>{b.title}</div>
//                       <div style={{ fontSize: 13, color: '#555' }}>{b.author || 'Unknown'}</div>
//                       <div style={{ fontSize: 13, color: '#444', marginTop: 6 }}>Genre: {b.genre || '—'}</div>
//                     </div>
//                     <div style={{ textAlign: 'right' }}>
//                       <div style={{ fontWeight: 700 }}>${(Number(b.price) || 0).toFixed(2)}</div>
//                       <div style={{ fontSize: 13, color: '#666' }}>{(b.stock ?? 0)} in stock</div>
//                     </div>
//                   </div>
//                   <div style={{ marginTop: 8, fontSize: 12, color: '#777' }}>
//                     Created: {b.createdAt ? new Date(b.createdAt).toLocaleString() : '—'}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </aside>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;









// import React, { useEffect, useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../api/axios';
// import { AuthContext } from '../context/AuthContext';

// const AdminDashboard = () => {
//   const [orders, setOrders] = useState([]);
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const normalizeOrders = (data) => {
//     if (!data) return [];
//     if (Array.isArray(data)) return data;
//     if (data.orders && Array.isArray(data.orders)) return data.orders;
//     if (data.items && Array.isArray(data.items)) return data.items;
//     return Array.isArray(data.data) ? data.data : [];
//   };

//   const normalizeBooks = (data) => {
//     if (!data) return [];
//     if (Array.isArray(data)) return data;
//     if (data.books && Array.isArray(data.books)) return data.books;
//     if (data.items && Array.isArray(data.items)) return data.items;
//     if (Array.isArray(data.data)) return data.data;
//     return [];
//   };

//   const fetch = async () => {
//     setLoading(true);
//     try {
//       if (!user || (user.role || '').toString().toLowerCase() !== 'admin') {
//         navigate('/login');
//         return;
//       }

//       const [oRes, bRes] = await Promise.all([
//         api.get('/orders'),
//         api.get('/books', { params: { limit: 50 } })
//       ]);

//       setOrders(normalizeOrders(oRes?.data));
//       setBooks(normalizeBooks(bRes?.data));
//     } catch (err) {
//       if (err.response && (err.response.status === 401 || err.response.status === 403)) {
//         navigate('/login');
//         return;
//       }
//       console.error('Admin fetch error', err);
//       alert(err.response?.data?.message || err.message || 'Failed to load admin data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetch(); /* eslint-disable-next-line */ }, []);

//   const changeStatus = async (id, statusLabel) => {
//     try {
//       // normalize and map UI labels to backend enum values
//       const label = String(statusLabel || '').trim().toLowerCase();
//       const map = {
//         processing: 'processing',
//         process: 'processing',
//         'in-progress': 'processing',
//         complete: 'delivered',
//         completed: 'delivered',
//         delivered: 'delivered',
//         shipped: 'shipped',
//         cancel: 'cancelled',
//         cancelled: 'cancelled',
//         pending: 'pending'
//       };
//       const status = map[label] || label; // fallback to lowercase label

//       await api.put(`/orders/${id}/status`, { status });
//       await fetch();
//     } catch (err) {
//       console.error('Status change failed', err);
//       alert(err.response?.data?.message || 'Failed to change status');
//     }
//   };

//   // improved createBook: ask for basic fields so created book has full info
//   const createBook = async () => {
//     const title = prompt('Title');
//     if (!title) return;
//     const author = prompt('Author') || 'Unknown';
//     const priceRaw = prompt('Price (number)', '100');
//     const stockRaw = prompt('Stock (integer)', '10');
//     const genre = prompt('Genre', 'General') || 'General';

//     const price = parseFloat(priceRaw) || 0;
//     const stock = parseInt(stockRaw, 10) || 0;

//     try {
//       await api.post('/books', { title, author, price, stock, genre });
//       await fetch();
//     } catch (err) {
//       console.error('Create book failed', err);
//       alert(err.response?.data?.message || 'Failed to create book');
//     }
//   };

//   if (loading) return <div style={{ padding: 20 }}>Loading admin data...</div>;

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Admin Dashboard</h2>

//       <div style={{ marginBottom: 12 }}>
//         <button onClick={createBook} style={{ padding: '8px 12px', borderRadius: 6 }}>Create Book</button>
//       </div>

//       <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
//         <section style={{ flex: 1, minWidth: 320 }}>
//           <h3>Orders</h3>
//           {orders.length === 0 ? <div>No orders</div> : (
//             <ul style={{ padding: 0, listStyle: 'none' }}>
//               {orders.map(o => (
//                 <li key={o._id || o.id} style={{ padding: 10, borderBottom: '1px solid #eee' }}>
//                   <div style={{ fontWeight: 700 }}>{o.user?.email || o.user?.name || 'Customer'}</div>
//                   <div style={{ fontSize: 13, color: '#666' }}>{o._id || o.id} · {o.status || o.orderStatus}</div>
//                   <div style={{ marginTop: 6 }}>
//                     <button onClick={() => changeStatus(o._id || o.id, 'processing')} style={{ marginRight: 8 }}>Processing</button>
//                     <button onClick={() => changeStatus(o._id || o.id, 'delivered')}>Complete</button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </section>

//         <aside style={{ width: 420 }}>
//           <h3>Books</h3>
//           {books.length === 0 ? <div>No books</div> : (
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
//               {books.map(b => (
//                 <div key={b._id || b.id} style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, background: '#fff' }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
//                     <div>
//                       <div style={{ fontWeight: 700 }}>{b.title}</div>
//                       <div style={{ fontSize: 13, color: '#555' }}>{b.author || 'Unknown'}</div>
//                       <div style={{ fontSize: 13, color: '#444', marginTop: 6 }}>Genre: {b.genre || '—'}</div>
//                     </div>
//                     <div style={{ textAlign: 'right' }}>
//                       <div style={{ fontWeight: 700 }}>${(Number(b.price) || 0).toFixed(2)}</div>
//                       <div style={{ fontSize: 13, color: '#666' }}>{(b.stock ?? 0)} in stock</div>
//                     </div>
//                   </div>
//                   <div style={{ marginTop: 8, fontSize: 12, color: '#777' }}>
//                     Created: {b.createdAt ? new Date(b.createdAt).toLocaleString() : '—'}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </aside>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;












// import React, { useEffect, useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../api/axios';
// import { AuthContext } from '../context/AuthContext';

// const AdminDashboard = () => {
//   const [orders, setOrders] = useState([]);
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const normalizeOrders = (data) => {
//     if (!data) return [];
//     if (Array.isArray(data)) return data;
//     if (data.orders && Array.isArray(data.orders)) return data.orders;
//     if (data.items && Array.isArray(data.items)) return data.items;
//     return Array.isArray(data.data) ? data.data : [];
//   };

//   const normalizeBooks = (data) => {
//     if (!data) return [];
//     if (Array.isArray(data)) return data;
//     if (data.books && Array.isArray(data.books)) return data.books;
//     if (data.items && Array.isArray(data.items)) return data.items;
//     if (Array.isArray(data.data)) return data.data;
//     return [];
//   };

//   const fetch = async () => {
//     setLoading(true);
//     try {
//       if (!user || (user.role || '').toString().toLowerCase() !== 'admin') {
//         navigate('/login');
//         return;
//       }

//       const [oRes, bRes] = await Promise.all([
//         api.get('/orders'),
//         api.get('/books', { params: { limit: 50 } })
//       ]);

//       setOrders(normalizeOrders(oRes?.data));
//       setBooks(normalizeBooks(bRes?.data));
//     } catch (err) {
//       if (err.response && (err.response.status === 401 || err.response.status === 403)) {
//         navigate('/login');
//         return;
//       }
//       console.error('Admin fetch error', err);
//       alert(err.response?.data?.message || err.message || 'Failed to load admin data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetch(); /* eslint-disable-next-line */ }, []);

//   const changeStatus = async (id, status) => {
//     try {
//       await api.put(`/orders/${id}/status`, { status });
//       await fetch();
//     } catch (err) {
//       console.error('Status change failed', err);
//       alert(err.response?.data?.message || 'Failed to change status');
//     }
//   };

//   // improved createBook: ask for basic fields so created book has full info
//   const createBook = async () => {
//     const title = prompt('Title');
//     if (!title) return;
//     const author = prompt('Author') || 'Unknown';
//     const priceRaw = prompt('Price (number)', '100');
//     const stockRaw = prompt('Stock (integer)', '10');
//     const genre = prompt('Genre', 'General') || 'General';

//     const price = parseFloat(priceRaw) || 0;
//     const stock = parseInt(stockRaw, 10) || 0;

//     try {
//       await api.post('/books', { title, author, price, stock, genre });
//       await fetch();
//     } catch (err) {
//       console.error('Create book failed', err);
//       alert(err.response?.data?.message || 'Failed to create book');
//     }
//   };

//   if (loading) return <div style={{ padding: 20 }}>Loading admin data...</div>;

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Admin Dashboard</h2>

//       <div style={{ marginBottom: 12 }}>
//         <button onClick={createBook} style={{ padding: '8px 12px', borderRadius: 6 }}>Create Book</button>
//       </div>

//       <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
//         <section style={{ flex: 1, minWidth: 320 }}>
//           <h3>Orders</h3>
//           {orders.length === 0 ? <div>No orders</div> : (
//             <ul style={{ padding: 0, listStyle: 'none' }}>
//               {orders.map(o => (
//                 <li key={o._id || o.id} style={{ padding: 10, borderBottom: '1px solid #eee' }}>
//                   <div style={{ fontWeight: 700 }}>{o.user?.email || o.user?.name || 'Customer'}</div>
//                   <div style={{ fontSize: 13, color: '#666' }}>{o._id || o.id} · {o.status || o.orderStatus}</div>
//                   <div style={{ marginTop: 6 }}>
//                     <button onClick={() => changeStatus(o._id || o.id, 'processing')} style={{ marginRight: 8 }}>Processing</button>
//                     <button onClick={() => changeStatus(o._id || o.id, 'completed')}>Complete</button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </section>

//         <aside style={{ width: 420 }}>
//           <h3>Books</h3>
//           {books.length === 0 ? <div>No books</div> : (
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
//               {books.map(b => (
//                 <div key={b._id || b.id} style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, background: '#fff' }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
//                     <div>
//                       <div style={{ fontWeight: 700 }}>{b.title}</div>
//                       <div style={{ fontSize: 13, color: '#555' }}>{b.author || 'Unknown'}</div>
//                       <div style={{ fontSize: 13, color: '#444', marginTop: 6 }}>Genre: {b.genre || '—'}</div>
//                     </div>
//                     <div style={{ textAlign: 'right' }}>
//                       <div style={{ fontWeight: 700 }}>${(Number(b.price) || 0).toFixed(2)}</div>
//                       <div style={{ fontSize: 13, color: '#666' }}>{(b.stock ?? 0)} in stock</div>
//                     </div>
//                   </div>
//                   <div style={{ marginTop: 8, fontSize: 12, color: '#777' }}>
//                     Created: {b.createdAt ? new Date(b.createdAt).toLocaleString() : '—'}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </aside>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


