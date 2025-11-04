import { Form } from "react-bootstrap";
import Tooltip from "../../components/Tooltip";


export default function CustomFieldsForm({ fields, onChange }) {
    if (!fields || fields.length === 0) {
        return <p className="text-muted">No custom fields available for this inventory.</p>;
    }

    return (
        <>
            {fields.map((field) => (
                <Form.Group className="mb-3" key={field.id}>
                    <div className="d-flex align-items-center mb-1">
                        <Form.Label className="me-2 mb-0">{field.name}</Form.Label>
                        {field.description && (
                            <Tooltip message={field.description} placement="right" />
                        )}
                    </div>

                    {(() => {
                        switch (field.type) {
                            case "SINGLE_LINE":
                                return (
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter value"
                                        onChange={(e) => onChange(field.id, e.target.value)}
                                    />
                                );

                            case "MULTI_LINE":
                                return (
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter text"
                                        onChange={(e) => onChange(field.id, e.target.value)}
                                    />
                                );

                            case "NUMERIC":
                                return (
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter number"
                                        onChange={(e) => onChange(field.id, e.target.value)}
                                    />
                                );

                            case "LINK":
                                return (
                                    <Form.Control
                                        type="url"
                                        placeholder="Enter link"
                                        onChange={(e) => onChange(field.id, e.target.value)}
                                    />
                                );

                            case "BOOLEAN":
                                return (
                                    <Form.Check
                                        type="checkbox"
                                        label={field.name}
                                        onChange={(e) => onChange(field.id, e.target.checked)}
                                    />
                                );

                            default:
                                return (
                                    <Form.Control
                                        type="text"
                                        disabled
                                        value="Unsupported field type"
                                    />
                                );
                        }
                    })()}
                </Form.Group>
            ))}
        </>
    );
}
