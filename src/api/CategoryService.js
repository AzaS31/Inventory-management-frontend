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
};

export default CategoryService;
