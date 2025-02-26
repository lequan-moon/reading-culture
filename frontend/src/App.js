import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NavBar from './components/layout/NavBar';
import Login from './components/auth/Login';
import BookList from './components/books/BookList';
import BookDetail from './components/books/BookDetail';
import BookReader from './components/books/BookReader';
import Preferences from './components/settings/Preferences';
import ParentalSettings from './components/settings/ParentalSettings';
import Profile from './components/profile/Profile';
import { Box } from '@mui/material';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar />
          <Box sx={{ p: 3 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<BookList />} />
              <Route path="/book/:id" element={<BookDetail />} />
              <Route 
                path="/book/:id/read" 
                element={
                  <ProtectedRoute>
                    <BookReader />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/preferences"
                element={
                  <ProtectedRoute>
                    <Preferences />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parental-settings"
                element={
                  <ProtectedRoute>
                    <ParentalSettings />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Box>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 