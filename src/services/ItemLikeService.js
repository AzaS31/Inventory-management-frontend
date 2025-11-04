import api from "../api/axios";

export const ItemLikeService = {
    async toggleLike(itemId) {
        const res = await api.post(`/item-likes/${itemId}/toggle-like`);
        return res.data;
    },

    async isItemLikedByUser(itemId) {
        const res = await api.get(`/item-likes/${itemId}/is-liked`);
        return res.data;
    },
};

