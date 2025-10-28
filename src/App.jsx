import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";
import Profile from "./pages/ProfilePage/ProfilePage";
import HomePage from "./pages/HomePage/HomePage";
import AdminPage from "./pages/AdminPage/AdminPage";
import InventoryPage from "./pages/InventoryPage/InventoryPage";
import InventoryCreatePage from "./pages/Inventories/InventoryCreatePage";
import InventoryEditPage from "./pages/Inventories/InventoryEditPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";


export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/inventories/:id" element={<InventoryPage />} />
        <Route path="/users/:id" element={<UserProfilePage />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="/inventories/create" element={<ProtectedRoute><InventoryCreatePage /></ProtectedRoute>} />
        <Route path="/inventories/:id/edit" element={<ProtectedRoute><InventoryEditPage /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}