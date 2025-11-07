import api from "../api/axios";

export const ItemService = {
    async getAll(inventoryId) {
        const res = await api.get(`/items/${inventoryId}/items`);
        return res.data;
    },

    async getById(inventoryId, id) {
        const res = await api.get(`/items/${inventoryId}/items/${id}`);
        return res.data;
    },

    async create(inventoryId, itemData, customFieldValues) {
        const res = await api.post(`/items/${inventoryId}/items`, {
            itemData,
            customFieldValues,
        });
        return res.data;
    },

    async update(inventoryId, id, expectedVersion, updateData, customFieldValues) {
        const res = await api.put(`/items/${inventoryId}/items/${id}`, {
            expectedVersion,
            updateData,
            customFieldValues,
        });
        return res.data;
    },

    async delete(inventoryId, id) {
        const res = await api.delete(`/items/${inventoryId}/items/${id}`);
        return res.data;
    },

    async deleteBatch(inventoryId, ids = []) {
        const res = await api.post(`/items/${inventoryId}/items/delete-batch`, { ids });
        return res.data;
    }
};

