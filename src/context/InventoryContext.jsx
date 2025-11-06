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
            try {
                const data = await fetchFunction();
                setState(data);
            } catch (err) {
                setError(err.response?.data?.message || `Failed to fetch ${type}`);
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
                () => InventoryService.getUserInventories(userId),
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
                () => InventoryService.getSharedWithUserInventories(userId),
                setSharedWithUserInventories,
                "shared with user inventories",
                false
            );
        },
        [fetchInventories]
    );

    const fetchSortedInventories = useCallback(
        (sortBy, order) => {
            fetchInventories(
                () => InventoryService.getSorted(sortBy, order),
                setMyInventories, 
                `sorted inventories by ${sortBy}`,
                false
            );
        },
        [fetchInventories]
    );

    const createInventory = useCallback(async (data) => {
        setLoading(true);
        try {
            const newInv = await InventoryService.create(data);
            setMyInventories(prev => [...prev, newInv]);
            return newInv;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create inventory");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateInventory = useCallback(
        async (id, data, ownerId) => {
            setLoading(true);
            try {
                const updated = await InventoryService.update(id, data);

                if (user?.id === ownerId) {
                    setMyInventories(prev => prev.map(inv => inv.id === id ? updated : inv));
                } else if (user?.role?.name === "ADMIN") {
                    const allStates = [
                        [myInventories, setMyInventories],
                        [sharedWithMeInventories, setSharedWithMeInventories],
                        [userInventories, setUserInventories],
                        [sharedWithUserInventories, setSharedWithUserInventories]
                    ];
                    allStates.forEach(([, setState]) => {
                        setState(prev => prev.map(inv => (inv.id === id ? updated : inv)));
                    });
                } else {
                    setSharedWithMeInventories(prev => prev.map(inv => inv.id === id ? updated : inv));
                }

                return updated;
            } catch (err) {
                setError(err.response?.data?.message || "Failed to update inventory");
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [user, myInventories, sharedWithMeInventories, userInventories, sharedWithUserInventories]
    );

    const deleteInventory = useCallback(
        async (id, ownerId) => {
            setLoading(true);
            try {
                await InventoryService.delete(id);

                if (user?.role?.name === "ADMIN") {
                    const allStates = [
                        [myInventories, setMyInventories],
                        [sharedWithMeInventories, setSharedWithMeInventories],
                        [userInventories, setUserInventories],
                        [sharedWithUserInventories, setSharedWithUserInventories]
                    ];
                    allStates.forEach(([, setState]) => {
                        setState(prev => prev.filter(inv => inv.id !== id));
                    });
                } else if (user?.id === ownerId) {
                    setMyInventories(prev => prev.filter(inv => inv.id !== id));
                } else {
                    setSharedWithMeInventories(prev => prev.filter(inv => inv.id !== id));
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to delete inventory");
            } finally {
                setLoading(false);
            }
        },
        [user, myInventories, sharedWithMeInventories, userInventories, sharedWithUserInventories]
    );

    const deleteInventoriesBatch = useCallback(
        async (ids) => {
            setLoading(true);
            try {
                await InventoryService.deleteBatch(ids);

                if (user?.role?.name === "ADMIN") {
                    const allStates = [
                        [myInventories, setMyInventories],
                        [sharedWithMeInventories, setSharedWithMeInventories],
                        [userInventories, setUserInventories],
                        [sharedWithUserInventories, setSharedWithUserInventories]
                    ];
                    allStates.forEach(([, setState]) => {
                        setState(prev => prev.filter(inv => !ids.includes(inv.id)));
                    });
                } else {
                    setMyInventories(prev => prev.filter(inv => !ids.includes(inv.id)));
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to delete selected inventories");
            } finally {
                setLoading(false);
            }
        },
        [user, myInventories, sharedWithMeInventories, userInventories, sharedWithUserInventories]
    );

    const getInventoryById = useCallback(async (id) => {
        try {
            return await InventoryService.getById(id);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch inventory");
            throw err;
        }
    }, []);

    const updateInventoryCustomIdFormat = useCallback(async (id, customIdFormat) => {
        setLoading(true);
        try {
            const updated = await InventoryService.updateCustomIdFormat(id, customIdFormat);
            setMyInventories(prev => prev.map(inv => inv.id === id ? updated : inv));
            return updated;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update custom ID format");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

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
                fetchSortedInventories,
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
