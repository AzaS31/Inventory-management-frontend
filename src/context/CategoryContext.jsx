import { createContext, useState, useContext, useEffect } from "react";
import CategoryService from "../api/CategoryService";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await CategoryService.getAll();
            setCategories(data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const createCategory = async (name) => {
        try {
            const newCat = await CategoryService.create({ name });
            setCategories((prev) => [...prev, newCat]);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create category");
        }
    };

    const updateCategory = async (id, data) => {
        try {
            const updated = await CategoryService.update(id, data);
            setCategories((prev) => prev.map(cat => (cat.id === id ? updated : cat)));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update category");
        }
    };

    const deleteCategory = async (id) => {
        try {
            await CategoryService.delete(id);
            setCategories((prev) => prev.filter(cat => cat.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete category");
        }
    };


    return (
        <CategoryContext.Provider
            value={{ categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory }}
        >
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => useContext(CategoryContext);
