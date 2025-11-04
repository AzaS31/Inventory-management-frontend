import { createContext, useContext, useState } from "react";
import { InventoryAccessService } from "../services/InventoryAccessService";

const InventoryAccessContext = createContext();

export const InventoryAccessProvider = ({ children }) => {
    const [accessList, setAccessList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAccessList = async (inventoryId) => {
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
    };

    const grantAccess = async (inventoryId, email) => {
        try {
            const access = await InventoryAccessService.addAccess(inventoryId, email);
            setAccessList((prev) => [...prev, access]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const revokeAccess = async (inventoryId, userId) => {
        try {
            await InventoryAccessService.removeAccess(inventoryId, userId);
            setAccessList((prev) => prev.filter((a) => a.user.id !== userId));
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    return (
        <InventoryAccessContext.Provider
            value={{
                accessList,
                loading,
                error,
                fetchAccessList,
                grantAccess,
                revokeAccess,
            }}
        >
            {children}
        </InventoryAccessContext.Provider>
    );
};

export const useInventoryAccess = () => useContext(InventoryAccessContext);
