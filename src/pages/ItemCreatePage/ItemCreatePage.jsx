import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Spinner, Card, Alert } from "react-bootstrap";
import { useCustomFields } from "../../context/CustomFieldContext";
import { useItem } from "../../context/ItemContext";
import { useInventory } from "../../context/InventoryContext";
import { useAuth } from "../../context/AuthContext";
import CustomFieldsForm from "./CustomFieldsForm";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function ItemCreatePage() {
    const { inventoryId } = useParams();
    const navigate = useNavigate();

    const { fields, loading: fieldsLoading, fetchFields } = useCustomFields();
    const { createItem } = useItem();
    const { getInventoryById } = useInventory();
    const { user } = useAuth();

    const [inventory, setInventory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [itemData, setItemData] = useState({
        name: "",
        description: "",
        author: "",
        year: "",
        pages: "",
    });

    const [customValues, setCustomValues] = useState({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const inv = await getInventoryById(inventoryId);
                setInventory(inv);
                await fetchFields(inventoryId);
            } catch (err) {
                console.error(err);
                setError("Failed to load inventory data");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [inventoryId]);

    const handleBaseChange = (field, value) => {
        setItemData((prev) => ({ ...prev, [field]: value }));
    };

    const handleChange = (fieldId, value) => {
        setCustomValues((prev) => ({
            ...prev,
            [fieldId]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedValues = Object.entries(customValues).map(
            ([customFieldId, value]) => ({
                customFieldId,
                value: value?.toString() ?? "",
            })
        );

        const payload = {
            ...itemData,
            year: parseInt(itemData.year, 10),
            pages: parseInt(itemData.pages, 10),
        };

        try {
            await createItem(inventoryId, payload, formattedValues);
            navigate(`/inventory/${inventoryId}`);
        } catch (err) {
            console.error("Error creating item:", err);
            alert("Error creating item");
        }
    };

    if (loading || fieldsLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger" className="mt-3">{error}</Alert>;
    }

    const hasWriteAccess = inventory.accesses?.some(a => a.user.id === user?.id);

    const canEdit =
        inventory?.isPublic || inventory?.ownerId === user?.id || hasWriteAccess;

    if (!canEdit) {
        return (
            <div className="container mt-5">
                <Alert variant="warning">You don’t have permission to add items to this inventory.</Alert>
                <Button variant="secondary" onClick={() => navigate(`/inventory/${inventoryId}`)}>
                    Back to Inventory
                </Button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <Breadcrumbs
                labelsMap={{
                    inventory: "Inventory",
                    item: itemData.name || "Item",
                }}
                idsMap={{
                    inventory: itemData.inventoryId,
                    item: `item/${itemData.id}`,
                }}
            />

            <h3 className="fw-bold mb-2">Create New Item</h3>
            <p className="text-muted">
                Inventory: <strong>{inventory?.title}</strong>{" "}
                ({inventory?.isPublic ? "Public" : "Private"})
            </p>

            <Card className="p-4 shadow-sm">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter item name"
                            value={itemData.name}
                            onChange={(e) => handleBaseChange("name", e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Enter description"
                            value={itemData.description}
                            onChange={(e) => handleBaseChange("description", e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Author</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter author"
                            value={itemData.author}
                            onChange={(e) => handleBaseChange("author", e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Year</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter year"
                            value={itemData.year}
                            onChange={(e) => handleBaseChange("year", e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Pages</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter number of pages"
                            value={itemData.pages}
                            onChange={(e) => handleBaseChange("pages", e.target.value)}
                            required
                        />
                    </Form.Group>

                    <h5 className="mb-3">Custom Fields</h5>
                    <CustomFieldsForm fields={fields} onChange={handleChange} />

                    <div className="d-flex justify-content-between mt-4">
                        <Button type="submit" variant="primary">
                            Save
                        </Button>
                        <Button variant="secondary" onClick={() => navigate(`/inventory/${inventoryId}`)}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
