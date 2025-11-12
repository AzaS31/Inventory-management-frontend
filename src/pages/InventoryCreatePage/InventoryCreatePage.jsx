import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useInventory } from "../../context/InventoryContext";
import { useCategory } from "../../context/CategoryContext";
import InventoryForm from "./InventoryForm";
import { useTags } from "../../context/TagContext";
import { useNotification } from "../../context/NotificationContext";

export default function InventoryCreatePage() {
    const { createInventory } = useInventory();
    const { categories, fetchCategories } = useCategory();
    const { assignTags } = useTags();
    const { notify } = useNotification();

    const [form, setForm] = useState({
        title: "",
        description: "",
        isPublic: true,
        categoryId: "",
        tags: [],
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

        const hasUniquePart = form.customIdFormat?.some(part =>
            ["SEQ", "GUID", "RAND6", "RAND9", "RAND20", "RAND32"].includes(part.type)
        );

        if (form.customIdFormat && !hasUniquePart) {
            alert("Custom ID format must include at least one unique part (SEQ, GUID, or RAND).");
            return;
        }

        try {
            const newInventory = await createInventory(form);

            if (form.tags?.length > 0) {
                await assignTags(newInventory.id, form.tags);
            }
            navigate(`/inventory/${newInventory.id}`);
            notify(`${newInventory.title} is created`)
        } catch (err) {
            console.error(err);
            notify("Failed to create inventory");
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
                        onCancel={() => navigate("/profile")}
                    />
                </Col>
            </Row>
        </Container>
    );
}
