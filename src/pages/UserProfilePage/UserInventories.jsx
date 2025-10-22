import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useInventory } from "../../context/InventoryContext";
import InventoryTableBase from "../../components/Inventories/InventoryTableBase";
import { useParams } from "react-router-dom";

export default function UserInventories() {
    const { id: userId } = useParams();
    const { userInventories, fetchUserInventories, loading } = useInventory();

    useEffect(() => {
        if (userId) {
            fetchUserInventories(userId);
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
        <InventoryTableBase data={userInventories} />
    )
}