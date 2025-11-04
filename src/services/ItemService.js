import api from "../api/axios";

export const ItemService = {
    async getAll(inventoryId) {
        const res = await api.get(`/items/${inventoryId}`);
        return res.data;
    },

    async getById(inventoryId, id) {
        const res = await api.get(`/items/${inventoryId}/${id}`);
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
        const res = await api.put(`/items/${inventoryId}/${id}`, {
            expectedVersion,
            updateData,
            customFieldValues,
        });
        return res.data;
    },

    async delete(inventoryId, id) {
        const res = await api.delete(`/items/${inventoryId}/${id}`);
        return res.data;
    },

    async deleteBatch(inventoryId, ids = []) {
        const res = await api.post(`/items/${inventoryId}/delete-batch`, { ids });
        return res.data;
    }
};

