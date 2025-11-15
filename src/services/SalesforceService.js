import api from "../api/axios";
const clientId = import.meta.env.VITE_SF_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SF_REDIRECT_URI;

export const SalesforceService = {
    async syncWithSalesforce(userData) {
        const res = await api.post('/salesforce/sync', userData);
        return res.data;
    },

    async unsyncWithSalesforce(email) {
        const res = await api.delete(`/salesforce/unsync/${email}`);
        return res.data;
    },

    getSalesforceAuthUrl(userId) {
        const state = encodeURIComponent(userId);
        return `https://login.salesforce.com/services/oauth2/authorize` +
            `?response_type=code` +
            `&client_id=${clientId}` +
            `&redirect_uri=${redirectUri}` +
            `&scope=api refresh_token` +
            `&state=${state}`;
    }
};

