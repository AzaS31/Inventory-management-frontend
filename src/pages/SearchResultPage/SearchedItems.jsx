import { Card } from "react-bootstrap";
import ItemTable from "../../components/ItemTable";

export default function SearchedItems({ items = [] }) {
    return (
        <Card className="mb-4 shadow-sm border-0">
            <Card.Header className="bg-dark text-white fw-bold">
                Items ({items.length})
            </Card.Header>
            <Card.Body>
                <ItemTable items={items} />
            </Card.Body>
        </Card>
    );
}
