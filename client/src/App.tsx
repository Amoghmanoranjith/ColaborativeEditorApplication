// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import './App.css'
import RoomDashboard from './pages/RoomDashboard';
import ColaborativeEditor from './components/ColaborativeEditor';
import Register from './pages/Register';

const App: React.FC = () => {
  localStorage.setItem('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNWU1YzFiMC1lMDJjLTRhMjYtOWQ4Yi1kNmVjZTMxZmRkZGQiLCJ1c2VyTmFtZSI6ImFtb2doIiwicm9vbUlkIjoiYzliNWE4ODEtM2IwMC00OGY2LTkyMTQtZDE1YmIwNGFkNmZlIiwicm9vbUNvZGUiOiIwOGYwZTU4M2Q3YjEiLCJpYXQiOjE3NDYxNzkxMzV9._JrZTeWRHAzZFmKJzKSVgm-Pg_EWATRLcwM-eN1OOqM')
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
      </Routes>
    </Router>
  );
};

export default App;




