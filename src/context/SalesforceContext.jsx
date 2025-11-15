import { createContext, useContext, useCallback } from "react";
import { SalesforceService } from "../services/SalesforceService";

const SalesforceContext = createContext();

export const SalesforceProvider = ({ children }) => {
    const syncWithSalesforce = useCallback(async (userData) => {
        try {
            return await SalesforceService.syncWithSalesforce(userData);
        } catch (error) {
            console.error("Salesforce sync failed:", error);
            throw error;
        }
    }, []);

    const getAuthUrl = useCallback((userId) => {
        return SalesforceService.getSalesforceAuthUrl(userId);
    }, []);

    const unsyncWithSalesforce = useCallback(async (email) => {
        try {
            return await SalesforceService.unsyncWithSalesforce(email);
        } catch (error) {
            console.error("Salesforce unsync failed", error);
            throw error;
        }
    }, []);

    return (
        <SalesforceContext.Provider value={{ syncWithSalesforce, unsyncWithSalesforce, getAuthUrl }}>
            {children}
        </SalesforceContext.Provider>
    );
};

export const useSalesforce = () => useContext(SalesforceContext);
