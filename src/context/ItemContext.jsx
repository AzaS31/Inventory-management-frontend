import { createContext, useState, useContext, useCallback } from "react";
import ItemService from "../api/ItemService";

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

    const createItem = useCallback(async (inventoryId, itemData, customFieldValues) => {
        const newItem = await ItemService.create(inventoryId, itemData, customFieldValues);
        setItems((prev) => [newItem, ...prev]);
        return newItem;
    }, []);

    const updateItem = useCallback(async (inventoryId, id, expectedVersion, updateData, customFieldValues) => {
        const updated = await ItemService.update(inventoryId, id, expectedVersion, updateData, customFieldValues);
        setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
        return updated;
    }, []);

    const deleteItem = useCallback(async (inventoryId, id) => {
        await ItemService.delete(inventoryId, id);
        setItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const addLike = useCallback(async (id) => {
        await ItemService.addLike(id);
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, _count: { likes: (item._count?.likes || 0) + 1 } } : item
            )
        );
    }, []);

    return (
        <ItemContext.Provider
            value={{
                items,
                loading,
                fetchItems,
                createItem,
                updateItem,
                deleteItem,
                addLike,
            }}
        >
            {children}
        </ItemContext.Provider>
    );
};

export const useItem = () => useContext(ItemContext);