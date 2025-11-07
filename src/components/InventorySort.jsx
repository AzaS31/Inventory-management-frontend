import { Form, Row, Col } from "react-bootstrap";

export default function InventorySort({ sortOption, onSort }) {
    const handleSortChange = (e) => {
        const [sortBy, order] = e.target.value.split("-");
        onSort(sortBy, order);
    };

    return (
        <Row className="mb-3">
            <Col xs={12} md={2}> 
                <Form.Select className="" value={sortOption} onChange={handleSortChange}>
                    <option value="title-asc">Title ↑</option>
                    <option value="title-desc">Title ↓</option>
                    <option value="category-asc">Category ↑</option>
                    <option value="category-desc">Category ↓</option>
                    <option value="createdAt-asc">Created At ↑</option>
                    <option value="createdAt-desc">Created At ↓</option>
                    <option value="updatedAt-asc">Updated At ↑</option>
                    <option value="updatedAt-desc">Updated At ↓</option>
                </Form.Select>
            </Col>
        </Row>
    );
}
