import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { InventoryService } from "../services/InventoryService";

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    const { user } = useAuth();
    const [latestInventories, setLatestInventories] = useState([]);
    const [topFiveInventories, setTopFiveInventories] = useState([]);
    const [sharedWithMeInventories, setSharedWithMeInventories] = useState([]);
    const [myInventories, setMyInventories] = useState([]);
    const [userInventories, setUserInventories] = useState([]);
    const [sharedWithUserInventories, setSharedWithUserInventories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchInventories = useCallback(
        async (fetchFunction, setState, type = "inventories", requireAuth = true) => {
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
        },
        [user]
    );

    const fetchMyInventories = useCallback(
        () => fetchInventories(InventoryService.getMy, setMyInventories, "my inventories", true),
        [fetchInventories]
    );

    const fetchTopFiveInventories = useCallback(
        () => fetchInventories(InventoryService.getTopFive, setTopFiveInventories, "top-5 inventories", false),
        [fetchInventories]
    );

    const fetchSharedWithMeInventories = useCallback(
        () => fetchInventories(InventoryService.getShared, setSharedWithMeInventories, "shared with me inventories", true),
        [fetchInventories]
    );

    const fetchLatestInventories = useCallback(
        () => fetchInventories(InventoryService.getLatest, setLatestInventories, "Latest inventories", false),
        [fetchInventories]
    );

    const fetchUserInventories = useCallback(
        (userId) => {
            if (!userId) return;
            fetchInventories(
                () => InventoryService.getUserInventories(targetUserId),
                setUserInventories,
                "user inventories",
                false
            );
        },
        [fetchInventories]
    );

    const fetchSharedWithUserInventories = useCallback(
        (userId) => {
            if (!userId) return;
            fetchInventories(
                () => InventoryService.getSharedWithUserInventories(targetUserId),
                setSharedWithUserInventories,
                "shared with user inventories",
                false
            );
        },
        [fetchInventories]
    );

    const createInventory = useCallback(async (data) => {
        try {
            const newInv = await InventoryService.create(data);
            setMyInventories((prev) => [...prev, newInv]);
            return newInv;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create inventory");
            throw err;
        }
    }, []);

    const getInventoryById = useCallback(async (id) => {
        try {
            return await InventoryService.getById(id);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch inventory");
            throw err;
        }
    }, []);

    const allStates = [
        [myInventories, setMyInventories],
        [sharedWithMeInventories, setSharedWithMeInventories],
        [userInventories, setUserInventories],
        [sharedWithUserInventories, setSharedWithUserInventories]
    ];

    const updateInAllStates = useCallback((id, updated) => {
        allStates.forEach(([, setState]) => {
            setState(prev => prev.map(inv => (inv.id === id ? updated : inv)));
        });
    }, [allStates]);

    const removeFromAllStates = useCallback((ids) => {
        allStates.forEach(([, setState]) => {
            setState(prev => prev.filter(inv => !ids.includes(inv.id)));
        });
    }, [allStates]);

    const updateInventory = useCallback(
        async (id, data, ownerId) => {
            try {
                const updated = await InventoryService.update(id, data);

                if (user?.id === ownerId) {
                    setMyInventories(prev => prev.map(inv => inv.id === id ? updated : inv));
                } else if (user?.role?.name === "ADMIN") {
                    updateInAllStates(id, updated);
                } else {
                    setSharedWithMeInventories(prev => prev.map(inv => inv.id === id ? updated : inv));
                }

                return updated;
            } catch (err) {
                setError(err.response?.data?.message || "Failed to update inventory");
                throw err;
            }
        },
        [user, updateInAllStates]
    );

    const updateInventoryCustomIdFormat = useCallback(async (id, customIdFormat) => {
        try {
            const updated = await InventoryService.updateCustomIdFormat(id, customIdFormat);
            setMyInventories((prev) => prev.map((inv) => (inv.id === id ? updated : inv)));
            return updated;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update custom ID format");
            throw err;
        }
    }, []);

    const deleteInventory = useCallback(
        async (id, ownerId) => {
            try {
                await InventoryService.delete(id);

                if (user?.role?.name === "ADMIN") {
                    removeFromAllStates([id]);
                }
                else if (user?.id === ownerId) {
                    setMyInventories(prev => prev.filter(inv => inv.id !== id));
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to delete inventory");
            }
        },
        [user, removeFromAllStates]
    );

    const deleteInventoriesBatch = useCallback(
        async (ids) => {
            try {
                await InventoryService.deleteBatch(ids);

                if (user?.role?.name === "ADMIN") {
                    removeFromAllStates(ids);
                } else if (user?.id === ownerId) {
                    setMyInventories(prev => prev.filter(inv => !ids.includes(inv.id)));
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to delete selected inventories");
            }
        },
        [user, removeFromAllStates]
    );

    useEffect(() => {
        if (user) fetchMyInventories();
    }, [user, fetchMyInventories]);

    return (
        <InventoryContext.Provider
            value={{
                latestInventories,
                topFiveInventories,
                myInventories,
                sharedWithMeInventories,
                userInventories,
                sharedWithUserInventories,
                loading,
                error,
                fetchLatestInventories,
                fetchTopFiveInventories,
                fetchMyInventories,
                fetchSharedWithMeInventories,
                fetchUserInventories,
                fetchSharedWithUserInventories,
                createInventory,
                getInventoryById,
                updateInventory,
                updateInventoryCustomIdFormat,
                deleteInventory,
                deleteInventoriesBatch,
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => useContext(InventoryContext);
