import api from "../api/axios";

export const InventoryAccessService = {
    async getAccessList(inventoryId) {
        const response = await api.get(`/inventory-access/${inventoryId}`);
        return response.data;
    },

    async addAccess(inventoryId, email) {
        const response = await api.post(`/inventory-access`, { inventoryId, email });
        return response.data;
    },

    async removeAccess(inventoryId, userId) {
        const response = await api.delete(`/inventory-access/${inventoryId}/${userId}`);
        return response.data;
    },
}
