import { createContext, useContext, useState, useCallback } from "react";
import { FindService } from "../services/FindService";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [results, setResults] = useState({ inventories: [], items: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const search = useCallback( async (query) => {
        if (!query.trim()) {
            setResults({ inventories: [], items: [] });
            return;
        }

        try {
            setLoading(true);
            const data = await FindService.search(query);
            setResults(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <SearchContext.Provider value={{ results, loading, error, search }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext);
