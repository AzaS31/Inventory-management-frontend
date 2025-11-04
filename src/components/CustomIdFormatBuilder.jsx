import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

export default function CustomIdFormatBuilder({ value = [], onChange }) {
    const [localFormat, setLocalFormat] = useState(value);
    const [previewId, setPreviewId] = useState("");

    const addPart = (type) => {
        const newPart = { type };
        if (type === "TEXT") newPart.value = "";
        if (type === "SEQ") newPart.digits = 6;
        if (type === "DATE") newPart.format = "YYYYMMDD";

        const updated = [...localFormat, newPart];
        setLocalFormat(updated);
        onChange(updated);
    };

    const updatePart = (index, field, newValue) => {
        const updated = [...localFormat];
        updated[index][field] = newValue;
        setLocalFormat(updated);
        onChange(updated);
    };

    const removePart = (index) => {
        const updated = localFormat.filter((_, i) => i !== index);
        setLocalFormat(updated);
        onChange(updated);
    };

    useEffect(() => {
        const generatePreview = () => {
            const parts = localFormat.map((part) => {
                switch (part.type) {
                    case "TEXT":
                        return part.value || "";
                    case "RAND6":
                        return Math.floor(100000 + Math.random() * 900000);
                    case "RAND9":
                        return Math.floor(100000000 + Math.random() * 900000000);
                    case "RAND20":
                        return Math.floor(Math.random() * 1048576);
                    case "RAND32":
                        return Math.floor(Math.random() * 4294967296);
                    case "GUID":
                        return crypto.randomUUID().slice(0, 8);
                    case "DATE": {
                        const date = new Date();
                        const yyyy = date.getFullYear();
                        const mm = String(date.getMonth() + 1).padStart(2, "0");
                        const dd = String(date.getDate()).padStart(2, "0");
                        return `${yyyy}${mm}${dd}`;
                    }
                    case "SEQ":
                        return String(1).padStart(part.digits || 6, "0");
                    default:
                        return "";
                }
            });
            const result = parts.join("-");

            setPreviewId(result || "(empty)");
        };

        generatePreview();
    }, [localFormat]);

    return (
        <Form.Group className="mb-3">
            <Form.Label>Custom ID Format</Form.Label>

            {localFormat.length === 0 && (
                <p className="text-muted small">No format parts yet.</p>
            )}

            {localFormat.map((part, index) => (
                <Row key={index} className="align-items-center mb-2">
                    <Col xs={4}>
                        <Form.Select
                            value={part.type}
                            onChange={(e) =>
                                updatePart(index, "type", e.target.value)
                            }
                        >
                            <option value="TEXT">TEXT</option>
                            <option value="RAND6">RAND6</option>
                            <option value="RAND9">RAND9</option>
                            <option value="RAND20">RAND20</option>
                            <option value="RAND32">RAND32</option>
                            <option value="GUID">GUID</option>
                            <option value="DATE">DATE</option>
                            <option value="SEQ">SEQ</option>
                        </Form.Select>
                    </Col>

                    <Col>
                        {part.type === "TEXT" && (
                            <Form.Control
                                type="text"
                                value={part.value || ""}
                                placeholder="Text value"
                                onChange={(e) =>
                                    updatePart(index, "value", e.target.value)
                                }
                            />
                        )}
                        {part.type === "SEQ" && (
                            <Form.Control
                                type="number"
                                value={part.digits || 6}
                                onChange={(e) =>
                                    updatePart(index, "digits", e.target.value)
                                }
                                placeholder="Digits"
                            />
                        )}
                    </Col>

                    <Col xs="auto">
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removePart(index)}
                        >
                            ×
                        </Button>
                    </Col>
                </Row>
            ))}

            <div className="mt-2">
                <Form.Select
                    onChange={(e) => {
                        if (e.target.value) {
                            addPart(e.target.value);
                            e.target.value = "";
                        }
                    }}
                >
                    <option value="">+ Add format part...</option>
                    <option value="TEXT">TEXT</option>
                    <option value="RAND6">RAND6</option>
                    <option value="RAND9">RAND9</option>
                    <option value="RAND20">RAND20</option>
                    <option value="RAND32">RAND32</option>
                    <option value="GUID">GUID</option>
                    <option value="DATE">DATE</option>
                    <option value="SEQ">SEQ</option>
                </Form.Select>
            </div>

            <div className="mt-3">
                <strong>Preview:</strong>
                <div className="mt-1 p-2 bg-light rounded border">
                    <code>{previewId}</code>
                </div>
            </div>
        </Form.Group>
    );
}
