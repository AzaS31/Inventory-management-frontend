import api from "./axios";

const ItemService = {
    getAll: async (inventoryId) => {
        const res = await api.get(`/items/${inventoryId}`);
        return res.data;
    },

    getById: async (inventoryId, itemId) => {
        const res = await api.get(`/items/${inventoryId}/${itemId}`);
        return res.data;
    },

    create: async (inventoryId, data) => {
        const res = await api.post(`/items/${inventoryId}/items`, data);
        return res.data;
    },

    update: async (inventoryId, itemId, data) => {
        const res = await api.put(`/items/${inventoryId}/${itemId}`, data);
        return res.data;
    },

    delete: async (inventoryId, itemId) => {
        const res = await api.delete(`/items/${inventoryId}/${itemId}`);
        return res.data;
    },
};

export default ItemService;
