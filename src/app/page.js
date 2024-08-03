'use client';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import POS from './pos';
import SalesReport from './salesreport';
import Login from './login';

const App = () => {
  const [user, setUser] = useState(null); // Manage logged-in user state
  const [transactions, setTransactions] = useState([]);

  const handleLogin = (user) => {
    setUser(user);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="/pos"
          element={
            user ? (
              <div className="app">
                <POS user={user} transactions={transactions} setTransactions={setTransactions} />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/sales-report"
          element={
            user ? (
              <div className="app">
                <SalesReport transactions={transactions} />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;