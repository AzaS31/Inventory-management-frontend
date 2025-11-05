import api from "../api/axios";

export const FindService = {
    async search(query) {
        try {
            const response = await api.get(`/search`, {
                params: { q: query },
            });
            return response.data;
        } catch (error) {
            console.error("Search error:", error);
            throw error;
        }
    },
};