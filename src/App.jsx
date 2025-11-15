import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";
import Profile from "./pages/ProfilePage/ProfilePage";
import HomePage from "./pages/HomePage/HomePage";
import AdminPage from "./pages/AdminPage/AdminPage";
import InventoryPage from "./pages/InventoryPage/InventoryPage";
import InventoryCreatePage from "./pages/InventoryCreatePage/InventoryCreatePage";
import ItemCreatePage from "./pages/ItemCreatePage/ItemCreatePage";
import ItemEditPage from "./pages/ItemEditPage/ItemEditPage";
import ItemPage from "./pages/ItemPage/ItemPage";
import SearchResultPage from "./pages/SearchResultPage/SearchResultPage";
import SyncWithSalesforceFormPage from "./pages/SyncSalesforceFormPage.jsx/SyncWithSalesforceFormPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";


export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/inventory/:id" element={<InventoryPage />} />
        <Route path="/users/:id" element={<UserProfilePage />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="/inventory/create" element={<ProtectedRoute><InventoryCreatePage /></ProtectedRoute>} />
        <Route path="/inventory/:inventoryId/item/create" element={<ProtectedRoute><ItemCreatePage /></ProtectedRoute>} />
        <Route path="/inventory/:inventoryId/item/:itemId/edit" element={<ProtectedRoute><ItemEditPage /></ProtectedRoute>} />
        <Route path="/inventory/:inventoryId/item/:itemId" element={<ItemPage />} />
        <Route path="/search" element={<SearchResultPage />} />
        <Route path="/salesforce/sync/:id" element={<ProtectedRoute><SyncWithSalesforceFormPage /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}