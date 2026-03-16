import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Staff from './pages/Staff';
import Departments from './pages/Departments';
import Posts from './pages/Posts';
import Recruitment from './pages/Recruitment';
import Layout from './components/Layout';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="/staff" replace />} />
            <Route path="staff" element={<Staff />} />
            <Route path="departments" element={<Departments />} />
            <Route path="posts" element={<Posts />} />
            <Route path="recruitment" element={<Recruitment />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
