import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import InventoryService from "../api/InventoryService";

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [inventories, setInventories] = useState([]);
    const [sharedInventories, setSharedInventories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMyInventories = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await InventoryService.getAll();
            setInventories(data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch inventories");
        } finally {
            setLoading(false);
        }
    };

    const fetchSharedInventories = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await InventoryService.getAll();
            setSharedInventories(data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch shared inventories");
        } finally {
            setLoading(false);
        }
    };

    const createInventory = async (data) => {
        try {
            const newInv = await InventoryService.create(data);
            setInventories((prev) => [...prev, newInv]);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create inventory");
        }
    };

    const updateInventory = async (id, data) => {
        try {
            const updated = await InventoryService.update(id, data);
            setInventories((prev) =>
                prev.map((inv) => (inv.id === id ? updated : inv))
            );
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update inventory");
        }
    };

    const deleteInventory = async (id) => {
        try {
            await InventoryService.delete(id);
            setInventories((prev) => prev.filter((inv) => inv.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete inventory");
        }
    };

    useEffect(() => {
        if (user) fetchMyInventories();
    }, [user]);

    return (
        <InventoryContext.Provider
            value={{
                inventories,
                sharedInventories,
                loading,
                error,
                fetchMyInventories,
                fetchSharedInventories,
                createInventory,
                updateInventory,
                deleteInventory,
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => useContext(InventoryContext);
