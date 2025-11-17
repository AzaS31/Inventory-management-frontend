import { useState } from "react";
import { Button, Spinner, Form } from "react-bootstrap";
import { useInventory } from "../../../context/InventoryContext";

export default function ApiTokenTab({ inventoryId, initialToken }) {
    const { generateApiToken } = useInventory();
    const [apiToken, setApiToken] = useState(initialToken || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = await generateApiToken(inventoryId);
            setApiToken(token);
        } catch {
            setError("Failed to generate API token");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(apiToken);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    return (
        <div className="d-flex flex-column">
            <div className="d-flex align-items-center mb-2">
                <Form.Control
                    type="text"
                    value={apiToken}
                    readOnly
                    placeholder="Odoo API Token"
                    className="me-2"
                    style={{ maxWidth: "300px" }}
                />

                <Button
                    size="sm"
                    onClick={handleGenerate}
                    disabled={loading}
                    className="me-2"
                >
                    {loading ? (
                        <Spinner as="span" animation="border" size="sm" />
                    ) : (
                        "Generate"
                    )}
                </Button>

                <Button
                    variant={copied ? "success" : "outline-secondary"}
                    size="sm"
                    onClick={handleCopy}
                    disabled={!apiToken}
                >
                    {copied ? "Copied!" : "Copy"}
                </Button>
            </div>

            <Form.Text className="text-muted">
                This API token grants access to Odoo endpoints for this inventory.
            </Form.Text>

            {error && <div className="text-danger mt-2">{error}</div>}
        </div>
    );
}
