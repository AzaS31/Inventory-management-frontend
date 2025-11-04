import { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import CustomIdFormatBuilder from "../../../components/CustomIdFormatBuilder";

export default function CustomIdTab({ inventory, onSaveCustomIdFormat }) {
    const [customIdFormat, setCustomIdFormat] = useState(inventory.customIdFormat || []);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setCustomIdFormat(inventory.customIdFormat || []);
    }, [inventory]);

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSaved(false);

        const hasUniquePart = customIdFormat.some(part =>
            ["SEQ", "GUID", "RAND6", "RAND9", "RAND20", "RAND32"].includes(part.type)
        );

        if (!hasUniquePart) {
            setError("The format must include at least one unique part (SEQ, GUID, or RAND).");
            setLoading(false);
            return;
        }

        try {
            await onSaveCustomIdFormat(inventory.id, customIdFormat);
            setSaved(true);
        } catch (err) {
            console.error(err);
            setError("Failed to save changes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-3">
            <h4>Custom Inventory Numbers</h4>
            <p>
                Here you can define the format for automatically generated item IDs
                in the inventory <strong>{inventory.title}</strong>.
            </p>
            <p className="text-muted">
                Example: <code>BK-{"{SEQ}"}</code> will create IDs like <code>BK-001</code>, <code>BK-002</code>, etc.
            </p>

            <Form className="mt-3">
                <CustomIdFormatBuilder value={customIdFormat} onChange={setCustomIdFormat} />

                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                {saved && <Alert variant="success" className="mt-3">Saved successfully!</Alert>}

                <div className="d-flex justify-content-end mt-3">
                    <Button variant="primary" onClick={handleSave} disabled={loading}>
                        {loading ? <Spinner size="sm" animation="border" /> : "Save changes"}
                    </Button>
                </div>
            </Form>
        </div>
    );
}
