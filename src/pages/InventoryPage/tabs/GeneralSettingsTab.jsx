import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useCategory } from "../../../context/CategoryContext";
import { useInventory } from "../../../context/InventoryContext";
import { useAuth } from "../../../context/AuthContext";
import TagSelector from "../../InventoryCreatePage/TagSelector";
import { useTags } from "../../../context/TagContext";
import { useNotification } from "../../../context/NotificationContext";

const GeneralSettingsTab = ({ inventory }) => {
    const { user } = useAuth();
    const { categories, fetchCategories } = useCategory();
    const { updateInventory } = useInventory();
    const { assignTags, getTagsByInventory } = useTags();

    const [form, setForm] = useState({
        title: inventory?.title || "",
        description: inventory?.description || "",
        categoryId: inventory?.categoryId || "",
        isPublic: inventory?.isPublic ?? true,
    });

    const [tags, setTags] = useState([]);
    const [loadingTags, setLoadingTags] = useState(false);
    const [saving, setSaving] = useState(false);
    const { notify } = useNotification();

    useEffect(() => {
        if (!categories.length) fetchCategories();
    }, [categories, fetchCategories]);

    useEffect(() => {
        const fetchTags = async () => {
            if (!inventory?.id) return;
            setLoadingTags(true);
            try {
                const currentTags = await getTagsByInventory(inventory.id);
                setTags(currentTags.map(t => t.name));
            } finally {
                setLoadingTags(false);
            }
        };
        fetchTags();
    }, [inventory, getTagsByInventory]);

    const handleChange = (field, value) => {
        let finalValue = value;
        if (field === "categoryId" && value === "") {
            finalValue = null;
        }
        setForm(prev => ({ ...prev, [field]: finalValue }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            const payload = {
                ...form,
                expectedVersion: inventory.version,
            };

            await updateInventory(inventory.id, payload, inventory.ownerId);
            await assignTags(inventory.id, tags);

            notify("Inventory updated successfully!");
        } catch (err) {
            console.error(err);
            if (err.response?.status === 409) {
                notify("This inventory was modified by another user. Please reload and try again.", "warning");
            } else {
                notify("Failed to update inventory", "danger");
            }
        } finally {
            setSaving(false);
        }
    };

    const canEdit = user?.id === inventory?.ownerId || user?.role?.name === "ADMIN";

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
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            value={form.isPublic ? "public" : "private"}
                            onChange={(e) => handleChange("isPublic", e.target.value === "public")}
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </Form.Select>
                    </Form.Group>

                    {loadingTags ? (
                        <div>Loading tags...</div>
                    ) : (
                        <TagSelector
                            value={tags}
                            onChange={setTags}
                            assignTags={assignTags}
                            inventoryId={inventory.id}
                        />
                    )}

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
                    <li><strong>Tags:</strong> {tags.join(", ") || "None"}</li>
                    <li><strong>Created At:</strong> {new Date(inventory.createdAt).toLocaleString()}</li>
                    <li><strong>Created By:</strong> {inventory.owner?.username || "Null"}</li>
                </ul>
            )}
        </div>
    );
};

export default GeneralSettingsTab;
