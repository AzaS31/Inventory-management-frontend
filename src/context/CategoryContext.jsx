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

    return (
        <CategoryContext.Provider
            value={{ categories, loading, error, fetchCategories }}
        >
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => useContext(CategoryContext);
