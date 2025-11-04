import { createContext, useContext, useState, useCallback } from "react";
import { ItemLikeService } from "../services/ItemLikeService";

const ItemLikeContext = createContext();

export const ItemLikeProvider = ({ children }) => {
    const [likedItems, setLikedItems] = useState({});
    const [likeCounts, setLikeCounts] = useState({});

    const hasLiked = useCallback(async (itemId) => {
        try {
            const { isLiked } = await ItemLikeService.isItemLikedByUser(itemId);
            setLikedItems((prev) => ({ ...prev, [itemId]: isLiked }));
            return isLiked;
        } catch (err) {
            console.error("Error checking like:", err);
            return false;
        }
    }, []);

    const toggleLike = useCallback(async (itemId) => {
        try {
            const { liked, message } = await ItemLikeService.toggleLike(itemId);

            setLikedItems((prev) => ({ ...prev, [itemId]: liked }));
            setLikeCounts((prev) => ({
                ...prev,
                [itemId]: (prev[itemId] || 0) + (liked ? 1 : -1),
            }));

            return liked;
        } catch (err) {
            console.error("Error toggling like:", err);
            throw err;
        }
    }, []);

    const likeCount = (itemId) => likeCounts[itemId] || 0;

    return (
        <ItemLikeContext.Provider
            value={{ likedItems, hasLiked, toggleLike, likeCount }}
        >
            {children}
        </ItemLikeContext.Provider>
    );
};

export const useItemLike = () => useContext(ItemLikeContext);
