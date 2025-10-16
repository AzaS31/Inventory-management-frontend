import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);

    const fetchProfile = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            setInitialLoading(false);
            return;
        }

        try {
            const res = await api.get("/auth/profile");
            setUser(res.data);
        } catch {
            setUser(null);
            localStorage.removeItem("token");
        } finally {
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);


    const login = async (credentials) => {
        const res = await api.post("/auth/login", credentials);
        localStorage.setItem("token", res.data.token);
        await fetchProfile(); 
        return res;
    };

    const register = async (data) => {
        const res = await api.post("/auth/register", data);
        localStorage.setItem("token", res.data.token);
        await fetchProfile(); 
        return res;
    };
    const logout = async () => {
        try {
            await api.get("/auth/logout");
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setUser(null);
            localStorage.removeItem("token");
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, setUser, login, register, logout, initialLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};
