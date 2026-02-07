import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SocialPage from "./pages/SocialPage";
import ProfilePage from "./components/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default page */}
        <Route path="/" element={<Register />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Social Page */}
        <Route
          path="/social"
          element={
            <ProtectedRoute>
              <SocialPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
