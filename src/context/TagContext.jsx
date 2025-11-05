import { createContext, useContext, useState, useCallback } from "react";
import { TagsService } from "../services/TagsService"

const TagContext = createContext();

export const TagProvider = ({ children }) => {
    const [allTags, setAllTags] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAllTags = useCallback( async () => {
        setLoading(true);
        try {
            const data = await TagService.getAll();
            setAllTags(data);
        } finally {
            setLoading(false);
        }
    }, []);

    const searchTags = useCallback( async (prefix) => {
        if (!prefix.trim()) return [];
        return await TagsService.search(prefix);
    }, []);

    const getTagsByInventory = useCallback( async (inventoryId) => {
        return await TagsService.getByInventory(inventoryId);
    }, []);

    const assignTags = useCallback( async (inventoryId, tags) => {
        console.log("Assigning tags", inventoryId, tags);
        return await TagsService.assign(inventoryId, tags);
    }, []);

    return (
        <TagContext.Provider
            value={{
                allTags,
                loading,
                fetchAllTags,
                searchTags,
                getTagsByInventory,
                assignTags,
            }}
        >
            {children}
        </TagContext.Provider>
    );
};

export const useTags = () => useContext(TagContext);
