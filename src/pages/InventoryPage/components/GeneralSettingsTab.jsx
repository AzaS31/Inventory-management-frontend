import React, { useState, useEffect, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { useCategory } from "../../../context/CategoryContext";
import { useInventory } from "../../../context/InventoryContext";
import { AuthContext, useAuth } from "../../../context/AuthContext";

const GeneralSettingsTab = ({ inventory }) => {
    const { user } = useAuth();
    const { categories, fetchCategories } = useCategory();
    const { updateMyInventory } = useInventory();

    const [form, setForm] = useState({
        title: inventory.title || "",
        description: inventory.description || "",
        categoryId: inventory.category?.id || "",
        isPublic: inventory.isPublic,
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (categories.length === 0) fetchCategories();
    }, [categories]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await updateMyInventory(inventory.id, form);
            alert("Inventory updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update inventory");
        } finally {
            setSaving(false);
        }
    };

    // Разрешено редактирование только владельцу и администратору
    const canEdit = user?.id === inventory.ownerId || user?.role === "ADMIN";

    return (
        <div className="p-3">
            <h4>General Settings</h4>
            {canEdit ? (
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={form.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={form.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            value={form.categoryId}
                            onChange={(e) => handleChange("categoryId", e.target.value)}
                        >
                            <option value="">Select category...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            value={form.isPublic ? "public" : "private"}
                            onChange={(e) =>
                                handleChange("isPublic", e.target.value === "public")
                            }
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </Form.Select>
                    </Form.Group>

                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </Form>
            ) : (
                <ul className="list-unstyled text-muted">
                    <li><strong>Title:</strong> {inventory.title}</li>
                    <li><strong>Category:</strong> {inventory.category?.name || "Null"}</li>
                    <li><strong>Description:</strong> {inventory.description || "Null"}</li>
                    <li><strong>Status:</strong> {inventory.isPublic ? "Public" : "Private"}</li>
                    <li><strong>Created At:</strong> {new Date(inventory.createdAt).toLocaleString()}</li>
                    <li><strong>Created By:</strong> {inventory.owner?.username || "Null"}</li>
                </ul>
            )}
        </div>
    );
};

export default GeneralSettingsTab;
