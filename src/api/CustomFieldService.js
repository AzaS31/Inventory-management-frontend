import api from "./axios";

const CustomFieldService = {
    async getAll(inventoryId) {
        const res = await api.get(`/custom-fields/${inventoryId}`);
        return res.data;
    },

    async create(inventoryId, fieldData) {
        const res = await api.post(`/custom-fields/${inventoryId}`, fieldData);
        return res.data;
    },

    async update(id, fieldData) {
        const res = await api.put(`/custom-fields/${id}`, fieldData);
        return res.data;
    },

    async delete(id) {
        const res = await api.delete(`/custom-fields/${id}`);
        return res.data;
    },
};

export default CustomFieldService;
