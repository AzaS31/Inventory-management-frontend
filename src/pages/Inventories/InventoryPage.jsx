import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInventory } from "../../context/InventoryContext";
import { Spinner, Card, Row, Col, Button } from "react-bootstrap";

export default function InventoryPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getInventoryById, loading } = useInventory();

    const [inventory, setInventory] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const data = await getInventoryById(id);
                setInventory(data);
            } catch (err) {
                console.error("Failed to load inventory:", err);
                setError("Failed to load inventory data.");
            }
        };

        fetchInventory();
    }, [id]);

    if (loading || !inventory) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-danger mt-4">{error}</p>;
    }

    return (
        <div className="container py-4">
            <Card className="shadow-sm">
                <Card.Body>
                    <Row className="align-items-center mb-3">
                        <Col>
                            <h3 className="mb-0">{inventory.title}</h3>
                            <p className="text-muted mb-0">
                                {inventory.category?.name || "No category"}
                            </p>
                        </Col>
                        <Col xs="auto">
                            <Button
                                variant="outline-primary"
                                onClick={() => navigate(`/inventories/${inventory.id}/edit`)}
                            >
                                Edit
                            </Button>
                        </Col>
                    </Row>

                    <p><strong>Description:</strong> {inventory.description || "No description"}</p>
                    <p><strong>Owner:</strong> {inventory.owner?.username || "Unknown"}</p>
                    <p><strong>Items:</strong> {inventory.itemsCount ?? 0}</p>
                    <p><strong>Created:</strong> {new Date(inventory.createdAt).toLocaleString()}</p>
                    <p><strong>Updated:</strong> {new Date(inventory.updatedAt).toLocaleString()}</p>
                </Card.Body>
            </Card>

            <div className="mt-5">
                <h4>Items</h4>
                <p className="text-muted">Coming soon...</p>
            </div>
        </div>
    );
}
