import { createContext, useContext, useState, useCallback } from "react";
import { UserService } from "../services/UserService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const fetchAllUsers = useCallback(async () => {
        setLoadingUsers(true);
        try {
            const data = await UserService.getAll();
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            throw err;
        } finally {
            setLoadingUsers(false);
        }
    }, []);

    const getUserById = async (id) => {
        try {
            return await UserService.getById(id);
        } catch (err) {
            console.error("Failed to fetch user by ID:", err);
            throw err;
        }
    };

    const changeRole = async (userIds, roleId) => {
        try {
            const res = await UserService.changeRole(userIds, roleId);
            await fetchAllUsers(); 
            return res;
        } catch (err) {
            console.error("Failed to change role:", err);
            throw err;
        }
    };

    const setActive = async (userIds, isActive) => {
        try {
            const res = await UserService.setActive(userIds, isActive);
            await fetchAllUsers();
            return res;
        } catch (err) {
            console.error("Failed to set active:", err);
            throw err;
        }
    };

    const deleteUsers = async (userIds) => {
        try {
            const res = await UserService.deleteUsers(userIds);
            await fetchAllUsers();
            return res;
        } catch (err) {
            console.error("Failed to delete users:", err);
            throw err;
        }
    };

    return (
        <UserContext.Provider
            value={{
                users,
                loadingUsers,
                fetchAllUsers,
                getUserById,
                changeRole,
                setActive,
                deleteUsers,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUsers = () => useContext(UserContext);
