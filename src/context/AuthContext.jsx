import { createContext, useState, useContext, useEffect, useCallback } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await api.get("/auth/profile");
            setUser(res.data);
        } catch {
            setUser(null);
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    }, []); 

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        if (token) {
            localStorage.setItem("token", token);
            window.history.replaceState({}, document.title, "/profile");
        }
        fetchProfile();
    }, [fetchProfile]);

    const login = useCallback(
        async (credentials) => {
            const res = await api.post("/auth/login", credentials);
            localStorage.setItem("token", res.data.token);
            await fetchProfile();
            return res;
        },
        [fetchProfile]
    );

    const register = useCallback(
        async (data) => {
            const res = await api.post("/auth/register", data);
            localStorage.setItem("token", res.data.token);
            await fetchProfile();
            return res;
        },
        [fetchProfile]
    );

    const logout = useCallback(async () => {
        try {
            await api.get("/auth/logout");
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setUser(null);
            localStorage.removeItem("token");
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
