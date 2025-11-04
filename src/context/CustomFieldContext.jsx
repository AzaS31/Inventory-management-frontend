import { createContext, useContext, useState } from "react";
import { CustomFieldService } from "../services/CustomFieldService";

const CustomFieldContext = createContext();

export function CustomFieldProvider({ children }) {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFields = async (inventoryId) => {
        setLoading(true);
        try {
            const data = await CustomFieldService.getAll(inventoryId);
            setFields(data);
        } catch (err) {
            console.error("Failed to fetch custom fields:", err);
        } finally {
            setLoading(false);
        }
    };

    const createField = async (inventoryId, fieldData) => {
        const newField = await CustomFieldService.create(inventoryId, fieldData);
        setFields((prev) => [...prev, newField]);
        return newField;
    };

    const updateField = async (id, fieldData) => {
        const updated = await CustomFieldService.update(id, fieldData);
        setFields((prev) =>
            prev.map((f) => (f.id === id ? updated : f))
        );
        return updated;
    };

    const deleteField = async (id) => {
        await CustomFieldService.delete(id);
        setFields((prev) => prev.filter((f) => f.id !== id));
    };

    return (
        <CustomFieldContext.Provider
            value={{ fields, loading, fetchFields, createField, updateField, deleteField }}
        >
            {children}
        </CustomFieldContext.Provider>
    );
}

export function useCustomFields() {
    return useContext(CustomFieldContext);
}
