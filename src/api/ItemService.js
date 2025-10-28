import api from "./axios";

const ItemService = {
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

    async addLike(id) {
        const res = await api.post(`/items/${id}/like`);
        return res.data;
    },
};

export default ItemService;
