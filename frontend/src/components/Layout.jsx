import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>St. Luke HR</h2>
        </div>
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>
        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li><Link to="/staff" onClick={() => setIsMenuOpen(false)}>Staff</Link></li>
          <li><Link to="/departments" onClick={() => setIsMenuOpen(false)}>Departments</Link></li>
          <li><Link to="/posts" onClick={() => setIsMenuOpen(false)}>Posts</Link></li>
          <li><Link to="/recruitment" onClick={() => setIsMenuOpen(false)}>Recruitment</Link></li>
        </ul>
        <div className="navbar-user">
          <span className="user-name">{user?.first_name} {user?.last_name}</span>
          <span className="user-role">{user?.role}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
