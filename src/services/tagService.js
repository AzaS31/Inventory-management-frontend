import api from "../api/axios";

export const tagService = {
    async getAll() {
        const res = await api.get("/tags");
        return res.data;
    },

    async search(prefix) {
        const res = await api.get(`/tags/search?q=${encodeURIComponent(prefix)}`);
        return res.data;
    },

    async getByInventory(inventoryId) {
        const res = await api.get(`/tags/inventory/${inventoryId}`);
        return res.data;
    },

    async assign(inventoryId, tags) {
        const res = await api.post("/tags/assign", { inventoryId, tags });
        return res.data;
    },
};
