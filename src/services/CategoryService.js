import api from "../api/axios";

export const CategoryService = {
    async getAll() {
        const res = await api.get("/categories");
        return res.data;
    },
    async getById(id) {
        const res = await api.get(`/categories/${id}`);
        return res.data;
    },
};


