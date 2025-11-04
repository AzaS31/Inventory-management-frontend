import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useSearch } from "../../context/SearchContext";
import { Container, Spinner, Alert } from "react-bootstrap";
import SearchedInventories from "./SearchedInventories";
import SearchedItems from "./SearchedItems";

export default function SearchResultPage() {
    const [searchParams] = useSearchParams();
    const { results, loading, search } = useSearch();
    const query = searchParams.get("q");

    useEffect(() => {
        if (query) {
            search(query);
        }
    }, [query]);

    return (
        <Container className="py-4">
            <h3 className="mb-4">
                Search results for: <span className="text-primary">"{query}"</span>
            </h3>

            {loading && (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status" />
                </div>
            )}

            {!loading && !results?.inventories?.length && !results?.items?.length && (
                <Alert variant="info" className="text-center">
                    No results found.
                </Alert>
            )}

            {!loading && (
                <>
                    {results?.inventories?.length > 0 && (
                        <SearchedInventories inventories={results.inventories} />
                    )}

                    {results?.items?.length > 0 && <SearchedItems items={results.items} />}
                </>
            )}
        </Container>
    );
}
