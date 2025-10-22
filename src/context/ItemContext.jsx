import { createContext, useState, useContext } from "react";
import ItemService from "../api/ItemService";

export const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchItems = async (inventoryId) => {
        setLoading(true);
        try {
            const data = await ItemService.getAll(inventoryId);
            setItems(data);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to load items");
        } finally {
            setLoading(false);
        }
    };

    const createItem = async (inventoryId, itemData) => {
        try {
            const newItem = await ItemService.create(inventoryId, itemData);
            setItems((prev) => [newItem, ...prev]);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create item");
        }
    };

    const updateItem = async (inventoryId, itemId, data) => {
        try {
            const updated = await ItemService.update(inventoryId, itemId, data);
            setItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)));
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update item");
        }
    };

    const deleteItem = async (inventoryId, itemId) => {
        try {
            await ItemService.delete(inventoryId, itemId);
            setItems((prev) => prev.filter((i) => i.id !== itemId));
        } catch (err) {
            setError(err.response?.data?.error || "Failed to delete item");
        }
    };

    return (
        <ItemContext.Provider
            value={{
                items,
                loading,
                error,
                fetchItems,
                createItem,
                updateItem,
                deleteItem,
            }}
        >
            {children}
        </ItemContext.Provider>
    );
};

export const useItems = () => useContext(ItemContext);
