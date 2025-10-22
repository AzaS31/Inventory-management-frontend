import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import InventoryService from "../api/InventoryService";

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [allInventories, setAllInventories] = useState([]);
    const [sharedWithMeInventories, setSharedWithMeInventories] = useState([]);
    const [myInventories, setMyInventories] = useState([]);
    const [userInventories, setUserInventories] = useState([]);
    const [sharedWithUserInventories, setSharedWithUserInventories] = useState([]);
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

    const fetchSharedWithMeInventories = () =>
        fetchInventories(InventoryService.getShared, setSharedWithMeInventories, "shared with me inventories", true);

    const fetchAllInventories = () =>
        fetchInventories(InventoryService.getAll, setAllInventories, "all inventories", false);

    const fetchUserInventories = (targetUserId) => {
        if (!targetUserId) return;
        fetchInventories(
            () => InventoryService.getUserInventories(targetUserId),
            setUserInventories,
            "user inventories",
            false
        );
    };

    const fetchSharedWithUserInventories = (targetUserId) => {
        if (!targetUserId) return;
        fetchInventories(() => InventoryService.getSharedWithUserInventories(targetUserId), setSharedWithUserInventories, "shared with user inventories", false);
    }

    const createInventory = async (data) => {
        try {
            const newInv = await InventoryService.create(data);
            setMyInventories((prev) => [...prev, newInv]);
            return newInv;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create inventory");
            throw err;
        }
    };

    const getInventoryById = async (id) => {
        try {
            const inventory = await InventoryService.getById(id);
            return inventory;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch inventory");
            throw err;
        }
    };

    const updateInventoryCommon = async (id, data, setState) => {
        try {
            const updated = await InventoryService.update(id, data);
            setState((prev) => prev.map((inv) => (inv.id === id ? updated : inv)));
            return updated;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update inventory");
            throw err;
        }
    };

    const updateMyInventory = async (id, data) => {
        return updateInventoryCommon(id, data, setMyInventories);
    };

    const updateSharedWithMeInventory = async (id, data) => {
        return updateInventoryCommon(id, data, setSharedWithMeInventories);
    };

    const deleteInventory = async (id) => {
        try {
            await InventoryService.delete(id);
            setMyInventories((prev) => prev.filter((inv) => inv.id !== id));
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
                sharedWithMeInventories,
                userInventories,
                sharedWithUserInventories,
                loading,
                error,
                fetchAllInventories,
                fetchMyInventories,
                fetchSharedWithMeInventories,
                fetchUserInventories,
                fetchSharedWithUserInventories,
                createInventory,
                getInventoryById,
                updateMyInventory,
                updateSharedWithMeInventory,
                deleteInventory,
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => useContext(InventoryContext);
