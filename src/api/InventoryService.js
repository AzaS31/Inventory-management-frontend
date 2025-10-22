import api from "./axios";

const InventoryService = {
    getAll: async () => {
        const res = await api.get("/inventories");
        return res.data;
    },

    getMy: async () => {
        const res = await api.get("/inventories/my");
        return res.data;
    },

    getShared: async () => {
        const res = await api.get("/inventories/shared");
        return res.data;
    },

    getUserInventories: async (userId) => {
        const res = await api.get(`/inventories/user/${userId}`);
        return res.data;
    },

    getSharedWithUserInventories: async (userId) => {
        const res = await api.get(`/inventories/user/${userId}/shared`);
        return res.data;
    },

    getById: async (id) => {
        const res = await api.get(`/inventories/${id}`);
        return res.data;
    },

    create: async (data) => {
        const res = await api.post("/inventories", data);
        return res.data;
    },

    update: async (id, data) => {
        const res = await api.put(`/inventories/${id}`, data);
        return res.data;
    },

    delete: async (id) => {
        const res = await api.delete(`/inventories/${id}`);
        return res.data;
    },
};

export default InventoryService;
