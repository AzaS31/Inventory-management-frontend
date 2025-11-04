import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Spinner, Card, Alert } from "react-bootstrap";
import { useCustomFields } from "../../context/CustomFieldContext";
import { useItem } from "../../context/ItemContext";
import { useInventory } from "../../context/InventoryContext";
import { useAuth } from "../../context/AuthContext";
import CustomFieldsForm from "../ItemCreatePage/CustomFieldsForm";
import Breadcrumbs from "../../components/Breadcrumbs";
import { getAccessInfo } from "../../utils/accessUtils";

export default function ItemEditPage() {
    const { inventoryId, itemId } = useParams();
    const navigate = useNavigate();

    const { fields, loading: fieldsLoading, fetchFields } = useCustomFields();
    const { getItemById, updateItem } = useItem();
    const { getInventoryById } = useInventory();
    const { user } = useAuth();

    const [inventory, setInventory] = useState(null);
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [itemData, setItemData] = useState({
        name: "",
        description: "",
    });

    const [customValues, setCustomValues] = useState({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const inv = await getInventoryById(inventoryId);
                setInventory(inv);

                const it = await getItemById(inventoryId, itemId);
                setItem(it);
                setItemData({
                    name: it.name,
                    description: it.description,
                });

                const values = {};
                it.customValues?.forEach(cv => {
                    values[cv.customFieldId] = cv.value;
                });
                setCustomValues(values);

                await fetchFields(inventoryId);
            } catch (err) {
                console.error(err);
                setError("Failed to load inventory or item data");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [inventoryId, itemId]);

    const handleBaseChange = (field, value) => {
        setItemData(prev => ({ ...prev, [field]: value }));
    };

    const handleChange = (fieldId, value) => {
        setCustomValues(prev => ({ ...prev, [fieldId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedValues = Object.entries(customValues).map(([customFieldId, value]) => ({
            customFieldId,
            value: value?.toString() ?? "",
        }));

        try {
            await updateItem(inventoryId, itemId, itemData, formattedValues);
            navigate(`/inventory/${inventoryId}/item/${itemId}`);
        } catch (err) {
            console.error("Error updating item:", err);
            alert("Error updating item");
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

    const { canEdit } = getAccessInfo({
        user,
        ownerId: item.creatorId,
        isPublic: inventory.isPublic ?? false,
        accesses: inventory.accesses ?? []
    });

    if (!canEdit) {
        return (
            <div className="container mt-5">
                <Alert variant="warning">You don’t have permission to edit this item.</Alert>
                <Button variant="secondary" onClick={() => navigate(`/inventory/${inventoryId}/item/${itemId}`)}>
                    Back to Item
                </Button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <Breadcrumbs
                labelsMap={{
                    inventory: "Inventory",
                    item: item?.name || "Item",
                    edit: "Edit",
                }}
                idsMap={{
                    inventory: inventoryId,
                    item: `item/${itemId}`,
                }}
            />

            <h3 className="fw-bold mb-2">Edit Item</h3>
            <p className="text-muted">
                Inventory: <strong>{inventory?.title}</strong> ({inventory?.isPublic ? "Public" : "Private"})
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
                        />
                    </Form.Group>

                    <h5 className="mb-3">Custom Fields</h5>
                    <CustomFieldsForm fields={fields} onChange={handleChange} values={customValues} />

                    <div className="d-flex justify-content-between mt-4">
                        <Button type="submit" variant="primary">
                            Save
                        </Button>
                        <Button variant="secondary" onClick={() => navigate(`/inventory/${inventoryId}/item/${itemId}`)}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
