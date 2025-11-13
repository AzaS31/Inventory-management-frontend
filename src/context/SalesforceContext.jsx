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

    return (
        <SalesforceContext.Provider value={{ syncWithSalesforce }}>
            {children}
        </SalesforceContext.Provider>
    );
};

export const useSalesforce = () => useContext(SalesforceContext);