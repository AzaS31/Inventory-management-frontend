import api from "../api/axios";

export const CommentService = {
    async getComments(inventoryId) {
        const res = await api.get(`/comments/comment/${inventoryId}`);
        return res.data;
    },

    async addComment(inventoryId, content) {
        const res = await api.post(`/comments/comment/${inventoryId}`, { content });
        return res.data;
    },

    async deleteComment(commentId) {
        const res = await api.delete(`/comments/comment/${commentId}`);
        return res.data;
    },
}
