import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import MyLists from './pages/MyLists';
import ListDetails from './pages/ListDetails';

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-lists"
          element={
            <ProtectedRoute>
              <MyLists />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lists/:id"
          element={
            <ProtectedRoute>
              <ListDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;