import { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";

export default function InventorySort({ sortBy, order, onSort }) {
    const handleSortChange = (e) => {
        onSort(e.target.value, order);
    };

    const handleOrderChange = (e) => {
        onSort(sortBy, e.target.value);
    };

    return (
        <Row className="mb-3">
            <Col xs={6} md={3}>
                <Form.Select value={sortBy} onChange={handleSortChange}>
                    <option value="title">Title</option>
                    <option value="category">Category</option>
                    <option value="createdAt">Created At</option>
                    <option value="updatedAt">Updated At</option>
                </Form.Select>
            </Col>
            <Col xs={6} md={3}>
                <Form.Select value={order} onChange={handleOrderChange}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </Form.Select>
            </Col>
        </Row>
    );
}

