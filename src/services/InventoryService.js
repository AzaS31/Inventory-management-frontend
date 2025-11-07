import api from "../api/axios";

export const InventoryService = {
    async getLatest() {
        const res = await api.get("/inventories/latest");
        return res.data;
    },

    async getTopFive() {
        const res = await api.get("/inventories/top5");
        return res.data;
    },

    async getMy() {
        const res = await api.get("/inventories/my");
        return res.data;
    },

    async getShared() {
        const res = await api.get("/inventories/shared");
        return res.data;
    },

    async getUserInventories(userId) {
        const res = await api.get(`/inventories/user/${userId}`);
        return res.data;
    },

    async getSharedWithUserInventories(userId) {
        const res = await api.get(`/inventories/user/${userId}/shared`);
        return res.data;
    },

    async getById(id) {
        const res = await api.get(`/inventories/${id}`);
        return res.data;
    },

    async getSorted(sortBy, order) {
        const res = await api.get(`/inventories/sorted`, {
            params: { sortBy, order }
        });
        return res.data;
    },

    async getFilteredByCategory(userId, categoryId) {
        console.log(userId, categoryId);
        
        const res = await api.get(`/inventories/filtered`, {
            params: { userId, categoryId }
        });
        return res.data;
    },

    async create(data) {
        const res = await api.post("/inventories", data);
        return res.data;
    },

    async update(id, data) {
        const res = await api.put(`/inventories/${id}`, data);
        return res.data;
    },

    async updateCustomIdFormat(id, customIdFormat) {
        const res = await api.put(`/inventories/${id}/custom-id-format`, { customIdFormat });
        return res.data;
    },

    async delete(id) {
        const res = await api.delete(`/inventories/${id}`);
        return res.data;
    },

    async deleteBatch(ids) {
        const res = await api.post("/inventories/delete-batch", { ids });
        return res.data;
    },
};


