import api from "../api/axios";

export const UserService = {
    async getAll() {
        const response = await api.get("/users");
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    async changeRole(userIds, roleId) {
        const response = await api.put("/users/role", { userIds, roleId });
        return response.data;
    },

    async setActive(userIds, isActive) {
        const response = await api.put("/users/active", { userIds, isActive });
        return response.data;
    },

    async deleteUsers(userIds) {
        const response = await api.delete("/users/delete", { data: { userIds } });
        return response.data;
    },
};


