// App.jsx

import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ToastProvider } from './context/ToastContext.jsx';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import CategoryPage from './pages/All/CategoryPage';
import ItemDetailPage from './pages/ItemDetailPage';
import Navbar from './component/Navbar/Navbar.jsx';

const App = () => {
    const location = useLocation();

    return (
        <ToastProvider>
            {location.pathname !== '/login' && <Navbar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/genre/:genre" element={<CategoryPage />} />
                <Route path="/language/:language" element={<CategoryPage />} />
                <Route path="/:type/:id" element={<ItemDetailPage />} />
            </Routes>
            <ToastContainer />
        </ToastProvider>
    );
};

export default App;