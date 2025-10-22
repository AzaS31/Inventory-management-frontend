import api from "./axios";

const UserService = {
    getAll: async () => {
        const response = await api.get("/users");
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    changeRole: async (userIds, roleId) => {
        const response = await api.put("/users/role", { userIds, roleId });
        return response.data;
    },

    setActive: async (userIds, isActive) => {
        const response = await api.put("/users/active", { userIds, isActive });
        return response.data;
    },

    deleteUsers: async (userIds) => {
        const response = await api.delete("/users/delete", { data: { userIds } });
        return response.data;
    },
};

export default UserService;
