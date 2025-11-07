import api from "../api/axios";

export const CategoryService = {
    async getAll() {
        const res = await api.get("/categories/all");
        return res.data;
    },
    async getById(id) {
        const res = await api.get(`/categories/category/${id}`);
        return res.data;
    },
};


