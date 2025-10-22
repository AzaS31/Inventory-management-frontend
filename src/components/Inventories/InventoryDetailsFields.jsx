import { Form } from "react-bootstrap";

export default function InventoryDetailsFields({
    title,
    description,
    isPublic,
    categoryId,
    categories,
    onChange,
}) {
    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => onChange("title", e.target.value)}
                    placeholder="Enter inventory title"
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => onChange("description", e.target.value)}
                    placeholder="Describe your collection"
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                    value={categoryId}
                    onChange={(e) => onChange("categoryId", e.target.value)}
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
                <Form.Check
                    type="checkbox"
                    label="Make Public"
                    checked={isPublic}
                    onChange={(e) => onChange("isPublic", e.target.checked)}
                />
            </Form.Group>
        </>
    );
}
