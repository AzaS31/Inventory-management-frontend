import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useInventory } from "../../context/InventoryContext";
import InventoryTableBase from "../../components/InventoryTableBase";
import { useParams } from "react-router-dom";

export default function SharedWithUserInventories() {
    const { id: userId } = useParams();
    const { sharedWithUserInventories, fetchSharedWithUserInventories, loading } = useInventory();

    useEffect(() => {
        if (userId) {
            fetchSharedWithUserInventories(userId);
        }
    }, [userId]);

    if (loading)
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );

    return (
        <InventoryTableBase data={sharedWithUserInventories} />
    )
}