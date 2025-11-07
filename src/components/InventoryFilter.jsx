import { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useCategory } from "../context/CategoryContext";

export default function InventoryFilter({ onFilter }) {
    const { categories, fetchCategories } = useCategory();
    const [categoryId, setCategoryId] = useState("");

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleChange = (value) => {
        setCategoryId(value);
        onFilter(value || undefined);
    };

    return (
        <Row className="mb-3">
            <Col xs={12} md={3}>
                <Form.Select
                    className="w-50"
                    value={categoryId}
                    onChange={(e) => handleChange(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </Form.Select>
            </Col>
        </Row>
    );
}

