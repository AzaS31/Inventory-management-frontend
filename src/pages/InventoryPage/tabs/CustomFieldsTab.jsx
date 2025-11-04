import { useEffect, useState } from "react";
import { Table, Form, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import { useCustomFields } from "../../../context/CustomFieldContext";

const FIELD_TYPES = [
    { value: "SINGLE_LINE", label: "Single Line" },
    { value: "MULTI_LINE", label: "Multi Line" },
    { value: "NUMERIC", label: "Number" },
    { value: "LINK", label: "Link" },
    { value: "BOOLEAN", label: "Boolean" },
];

export default function CustomFieldsTab({ inventoryId }) {
    const { fields, loading, fetchFields, createField, updateField, deleteField } =
        useCustomFields();

    const [newField, setNewField] = useState({
        name: "",
        type: "SINGLE_LINE",
        showInTable: true,
    });
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [selectedFields, setSelectedFields] = useState([]);

    useEffect(() => {
        if (!inventoryId) return;
        fetchFields(inventoryId);
    }, [inventoryId]);

    const handleAdd = async () => {
        if (fields.length >= 3) {
            setError("You can create up to 3 custom fields per inventory.");
            return;
        }
        if (!newField.name.trim()) {
            setError("Field name is required.");
            return;
        }

        setSaving(true);
        try {
            await createField(inventoryId, newField);
            setNewField({
                name: "",
                type: "SINGLE_LINE",
                showInTable: true,
            });
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to create field.");
        } finally {
            setSaving(false);
        }
    };

    const handleSelectField = (fieldId) => {
        setSelectedFields((prev) =>
            prev.includes(fieldId)
                ? prev.filter((id) => id !== fieldId)
                : [...prev, fieldId]
        );
    };

    const handleSelectAll = (checked) => {
        setSelectedFields(checked ? fields.map((f) => f.id) : []);
    };

    const handleDeleteSelected = async () => {
        if (selectedFields.length === 0) return;
        if (!window.confirm(`Delete ${selectedFields.length} field(s)?`)) return;

        try {
            for (const id of selectedFields) {
                await deleteField(id);
            }
            setSelectedFields([]);
        } catch (err) {
            console.error(err);
            setError("Failed to delete selected fields.");
        }
    };

    const handleToggleShowInTable = async (field) => {
        await updateField(field.id, { ...field, showInTable: !field.showInTable });
    };

    return (
        <div className="p-3">
            <h5>Custom Fields Settings</h5>
            <p className="text-muted mb-3">
                Define up to 3 additional fields for your inventory items.
            </p>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="align-items-end mb-3">
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={newField.name}
                            onChange={(e) =>
                                setNewField({ ...newField, name: e.target.value })
                            }
                            placeholder="Enter custom field name"
                        />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={newField.description || ""}
                            onChange={(e) =>
                                setNewField({ ...newField, description: e.target.value })
                            }
                            placeholder="Enter description (shown as tooltip)"
                        />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Type</Form.Label>
                        <Form.Select
                            value={newField.type}
                            onChange={(e) =>
                                setNewField({ ...newField, type: e.target.value })
                            }
                        >
                            {FIELD_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Check
                        type="checkbox"
                        label="Show in table"
                        checked={newField.showInTable}
                        onChange={(e) =>
                            setNewField({ ...newField, showInTable: e.target.checked })
                        }
                    />
                </Col>
                <Col md={1}>
                    <Button
                        onClick={handleAdd}
                        disabled={saving || fields.length >= 3}
                    >
                        {saving ? <Spinner size="sm" animation="border" /> : "Add"}
                    </Button>
                </Col>
            </Row>

            {fields.length > 0 && (
                <div className="d-flex justify-content-between mb-2 align-items-center">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={handleDeleteSelected}
                        disabled={selectedFields.length === 0}
                    >
                        Delete
                    </Button>
                    <span>{selectedFields.length} selected</span>
                </div>
            )}

            {loading ? (
                <Spinner animation="border" />
            ) : (
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th style={{ width: "40px" }}>
                                <Form.Check
                                    type="checkbox"
                                    onChange={(e) =>
                                        handleSelectAll(e.target.checked)
                                    }
                                    checked={
                                        selectedFields.length === fields.length &&
                                        fields.length > 0
                                    }
                                />
                            </th>
                            <th style={{ width: "50px" }}>#</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Show in Table</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((field, index) => (
                            <tr key={field.id}>
                                <td className="text-center">
                                    <Form.Check
                                        type="checkbox"
                                        checked={selectedFields.includes(field.id)}
                                        onChange={() => handleSelectField(field.id)}
                                    />
                                </td>
                                <td>{index + 1}</td>
                                <td>{field.name}</td>
                                <td>{field.type}</td>
                                <td>
                                    <Form.Check
                                        type="checkbox"
                                        checked={field.showInTable}
                                        onChange={() => handleToggleShowInTable(field)}
                                    />
                                </td>
                            </tr>
                        ))}
                        {fields.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center text-muted">
                                    No custom fields yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}
        </div>
    );
}
