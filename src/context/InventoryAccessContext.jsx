import { createContext, useContext, useState, useCallback } from "react";
import { InventoryAccessService } from "../services/InventoryAccessService";

const InventoryAccessContext = createContext();

export const InventoryAccessProvider = ({ children }) => {
    const [accessList, setAccessList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    const fetchAccessList = useCallback(async (inventoryId) => {
        setLoading(true);
        try {
            const list = await InventoryAccessService.getAccessList(inventoryId);
            setAccessList(list);
        } catch (err) {
            console.error(err);
            setError("Failed to load access list");
        } finally {
            setLoading(false);
        }
    }, []);

    const grantAccess = useCallback(async (inventoryId, identifier) => {
        try {
            const access = await InventoryAccessService.addAccess(inventoryId, identifier);
            setAccessList((prev) => [...prev, access]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }, []);

    const revokeAccess = useCallback(async (inventoryId, userId) => {
        try {
            await InventoryAccessService.removeAccess(inventoryId, userId);
            setAccessList((prev) => prev.filter((a) => a.user.id !== userId));
        } catch (err) {
            console.error(err);
            throw err;
        }
    }, []);

    const searchUsers = useCallback(async (query) => {
        try {
            const results = await InventoryAccessService.searchUsers(query);
            setSearchResults(results);
        } catch (err) {
            console.error("User search failed:", err);
        }
    }, []);

    return (
        <InventoryAccessContext.Provider
            value={{
                accessList,
                loading,
                error,
                fetchAccessList,
                grantAccess,
                revokeAccess,
                searchResults,
                searchUsers,
            }}
        >
            {children}
        </InventoryAccessContext.Provider>
    );
};

export const useInventoryAccess = () => useContext(InventoryAccessContext);
