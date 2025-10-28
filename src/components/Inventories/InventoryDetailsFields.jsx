import { Form } from "react-bootstrap";
import CustomIdFormatBuilder from "./CustomIdFormatBuilder";

export default function InventoryDetailsFields({
    title,
    description,
    access = "public",
    categoryId,
    categories,
    customIdFormat,
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

            <CustomIdFormatBuilder
                value={customIdFormat}
                onChange={(updated) => onChange("customIdFormat", updated)}
            />

            <Form.Group className="mb-3">
                <Form.Label>Access</Form.Label>
                <Form.Select
                    value={access}
                    onChange={(e) => onChange("access", e.target.value)}
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </Form.Select>
            </Form.Group>
        </>
    );
}
