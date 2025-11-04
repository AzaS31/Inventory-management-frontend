import { createContext, useContext, useState } from "react";
import { tagService } from "../services/tagService";

const TagContext = createContext();

export const TagProvider = ({ children }) => {
    const [allTags, setAllTags] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAllTags = async () => {
        setLoading(true);
        try {
            const data = await tagService.getAll();
            setAllTags(data);
        } finally {
            setLoading(false);
        }
    };

    const searchTags = async (prefix) => {
        if (!prefix.trim()) return [];
        return await tagService.search(prefix);
    };

    const getTagsByInventory = async (inventoryId) => {
        return await tagService.getByInventory(inventoryId);
    };

    const assignTags = async (inventoryId, tags) => {
        return await tagService.assign(inventoryId, tags);
    };

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
