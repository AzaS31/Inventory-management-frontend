import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useInventory } from "../../context/InventoryContext";
import InventoryTableBase from "../../components/InventoryTableBase";

export default function SharedWithMeInventories() {
    const { sharedWithMeInventories, fetchSharedWithMeInventories } = useInventory();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchSharedWithMeInventories();
            setLoading(false);
        };
        fetchData();
    }, [fetchSharedWithMeInventories]);

    if (loading)
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );

    return (
        <InventoryTableBase
            data={sharedWithMeInventories}
        />
    );
}
