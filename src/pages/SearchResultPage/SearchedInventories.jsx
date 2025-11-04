import { Card } from "react-bootstrap";
import InventoryTableBase from "../../components/InventoryTableBase";

export default function SearchedInventories({ inventories = [] }) {
    return (
        <Card className="mb-4 shadow-sm border-0">
            <Card.Header className="bg-dark text-white fw-bold">
                Inventories ({inventories.length})
            </Card.Header>
            <Card.Body>
                <InventoryTableBase data={inventories} />
            </Card.Body>
        </Card>
    );
}
