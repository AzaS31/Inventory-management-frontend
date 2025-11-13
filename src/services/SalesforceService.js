import api from "../api/axios";

export const SalesforceService = {
    async syncWithSalesforce(userData) {
        const res = await api.post('/salesforce/sync', userData);
        return res.data;
    }
};
