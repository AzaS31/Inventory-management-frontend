import api from "../api/axios";

const CategoryService = {
    getAll: async () => {
        const res = await api.get("/categories");
        return res.data;
    },
    getById: async (id) => {
        const res = await api.get(`/categories/${id}`);
        return res.data;
    },
    create: async (data) => {
        const res = await api.post("/categories", data);
        return res.data;
    },
    update: async (id, data) => {
        const res = await api.put(`/categories/${id}`, data);
        return res.data;
    },
    delete: async (id) => {
        const res = await api.delete(`/categories/${id}`);
        return res.data;
    },
};

export default CategoryService;
