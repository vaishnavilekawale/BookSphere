import axios from 'axios';

const raw = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// remove any trailing slash or trailing /api segment
let baseHost = raw.replace(/\/+$/, '');
baseHost = baseHost.replace(/\/api$/i, '');
const api = axios.create({
  baseURL: `${baseHost}/api`,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;

// import axios from 'axios';

// const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// const api = axios.create({
//   baseURL: `${BASE}/api`,
//   timeout: 10000,
// });

// // Attach token if present
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Optional: central response handler (passes errors through)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Example: auto-logout on 401 (uncomment if you want this behavior)
//     // if (error.response?.status === 401) {
//     //   localStorage.removeItem('token');
//     //   localStorage.removeItem('user');
//     // }
//     return Promise.reject(error);
//   }
// );

// export default api;







// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default api;


// import axios from "axios";

//  const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });
//  // attach token automatically
//  api.interceptors.request.use((config) => {
//  const token = localStorage.getItem('token');
//  if (token) config.headers.Authorization = `Bearer ${token}`;
//  return config;
//  });
//  export default api;