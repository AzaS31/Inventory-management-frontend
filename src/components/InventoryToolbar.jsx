import { Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function InventoryToolbar({ selectedCount, onCreate, onEdit, onDelete }) {
    const navigate = useNavigate();
    
    return (
        <Row className="align-items-center mb-3">
            <Col xs="auto">
                <Button variant="primary" onClick={() => navigate("/inventories/create")}>
                    Create
                </Button>
                <Button
                    variant="outline-secondary"
                    className="ms-2"
                    onClick={onEdit}
                    disabled={selectedCount !== 1}
                >
                    Edit
                </Button>
                <Button
                    variant="outline-secondary"
                    className="ms-2"
                    onClick={onDelete}
                    disabled={selectedCount === 0}
                >
                    Delete
                </Button>
            </Col>
            <Col className="text-end">
                <small className="text-muted">
                    {selectedCount > 0
                        ? `${selectedCount} selected`
                        : "No inventories selected"}
                </small>
            </Col>
        </Row>
    );
}
