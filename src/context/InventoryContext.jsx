import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import InventoryService from "../api/InventoryService";

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [allInventories, setAllInventories] = useState([]);
    const [sharedInventories, setSharedInventories] = useState([]);
    const [myInventories, setMyInventories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchInventories = async (fetchFunction, setState, type = "inventories", requireAuth = true) => {
        if (requireAuth && !user) return;
        setLoading(true);

        try {
            const data = await fetchFunction();
            setState(data);
        } catch (err) {
            setError(err.response?.data?.message || `Failed to fetch ${type}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyInventories = () =>
        fetchInventories(InventoryService.getMy, setMyInventories, "my inventories", true);

    const fetchSharedInventories = () =>
        fetchInventories(InventoryService.getShared, setSharedInventories, "shared inventories", true);

    const fetchAllInventories = () =>
        fetchInventories(InventoryService.getAll, setAllInventories, "all inventories", false);

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
                allInventories,
                myInventories,
                sharedInventories,
                loading,
                error,
                fetchAllInventories,
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
