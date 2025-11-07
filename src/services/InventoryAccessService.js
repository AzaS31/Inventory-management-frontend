import api from "../api/axios";

export const InventoryAccessService = {
    async getAccessList(inventoryId) {
        const response = await api.get(`/inventory-access/access/${inventoryId}`);
        return response.data;
    },

    async addAccess(inventoryId, identifier) {
        const response = await api.post(`/inventory-access/add`, { inventoryId, identifier });
        return response.data;
    },

    async removeAccess(inventoryId, userId) {
        const response = await api.delete(`/inventory-access/${inventoryId}/user/${userId}`);
        return response.data;
    },

    async searchUsers(query) {
        if (!query || query.trim().length < 2) return [];
        const response = await api.get(`/inventory-access/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },
};
