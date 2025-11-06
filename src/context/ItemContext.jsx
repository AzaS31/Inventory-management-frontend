import { createContext, useState, useContext, useCallback } from "react";
import { ItemService } from "../services/ItemService";

const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchItems = useCallback(async (inventoryId) => {
        setLoading(true);
        try {
            const data = await ItemService.getAll(inventoryId);
            setItems(data);
        } finally {
            setLoading(false);
        }
    }, []);

    const getItemById = useCallback(
        async (inventoryId, id) => {
            setLoading(true);
            try {
                const data = await ItemService.getById(inventoryId, id);
                setItems((prev) => {
                    const exists = prev.find(item => item.id === id);
                    if (exists) {
                        return prev.map(item => (item.id === id ? data : item));
                    } else {
                        return [...prev, data];
                    }
                });
                return data;
            } finally {
                setLoading(false);
            }
        }, []);

    const createItem = useCallback(
        async (inventoryId, itemData, customFieldValues) => {
            const newItem = await ItemService.create(inventoryId, itemData, customFieldValues);
            setItems((prev) => [newItem, ...prev]);
            return newItem;
        }, []);

    const updateItem = useCallback(
        async (inventoryId, id, expectedVersion, updateData, customFieldValues) => {
            const updated = await ItemService.update(inventoryId, id, expectedVersion, updateData, customFieldValues);
            setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
            return updated;
        }, []);

    const deleteItem = useCallback(
        async (inventoryId, id) => {
            await ItemService.delete(inventoryId, id);
            setItems((prev) => prev.filter((item) => item.id !== id));
        }, []);

    const deleteBatch = useCallback(
        async (inventoryId, ids) => {
            const res = await ItemService.deleteBatch(inventoryId, ids);
            setItems((prev) => prev.filter(item => !ids.includes(item.id)));
            return res.deletedCount;
        }, []);

    return (
        <ItemContext.Provider
            value={{
                items,
                loading,
                fetchItems,
                getItemById,
                createItem,
                updateItem,
                deleteItem,
                deleteBatch,
            }}
        >
            {children}
        </ItemContext.Provider>
    );
};

export const useItem = () => useContext(ItemContext);
