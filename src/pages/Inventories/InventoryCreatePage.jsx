import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useInventory } from "../../context/InventoryContext";
import { useCategory } from "../../context/CategoryContext";
import InventoryForm from "../../components/Inventories/InventoryForm";

export default function InventoryCreatePage() {
    const { createInventory } = useInventory();
    const { categories, fetchCategories } = useCategory();

    const [form, setForm] = useState({
        title: "",
        description: "",
        isPublic: false,
        categoryId: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (categories.length === 0) fetchCategories();
    }, [categories.length]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newInventory = await createInventory(form);
            navigate(`/inventories/${newInventory.id}`);
        } catch (err) {
            console.error(err);
            alert("Failed to create inventory");
        }
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h4 className="mb-3">Create New Inventory</h4>
                    <InventoryForm
                        {...form}
                        categories={categories}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onCancel={() => navigate("/inventories")}
                    />
                </Col>
            </Row>
        </Container>
    );
}
