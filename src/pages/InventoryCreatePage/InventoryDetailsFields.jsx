import { Form, Row, Col } from "react-bootstrap";
import CustomIdFormatBuilder from "../../components/CustomIdFormatBuilder";
import TagSelector from "./TagSelector";
import ReactMarkdown from "react-markdown";

export default function InventoryDetailsFields({
    title,
    description,
    isPublic,
    categoryId,
    categories,
    customIdFormat,
    tags,
    onChange,
}) {
    const access = isPublic ? "public" : "private";

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
                <Form.Label>Description (Markdown supported)</Form.Label>
                <Row>
                    <Col md={6}>
                        <Form.Control
                            as="textarea"
                            rows={6}
                            value={description}
                            onChange={(e) => onChange("description", e.target.value)}
                            placeholder="Describe your collection in Markdown"
                            required
                        />
                    </Col>
                    <Col md={6}>
                        <div
                            className="border p-2"
                            style={{ height: "100%", overflowY: "auto", backgroundColor: "#f8f9fa" }}
                        >
                            <ReactMarkdown>
                                {description || "Preview will appear here..."}
                            </ReactMarkdown>
                        </div>
                    </Col>
                </Row>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                    value={categoryId}
                    onChange={(e) => onChange("categoryId", e.target.value)}
                    required
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

            <TagSelector
                value={tags || []}
                onChange={(newTags) => onChange("tags", newTags)}
            />

            <Form.Group className="mb-3">
                <Form.Label>Access</Form.Label>
                <Form.Select
                    value={access}
                    onChange={(e) => {
                        const val = e.target.value;
                        onChange("isPublic", val === "public");
                    }}
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </Form.Select>
            </Form.Group>
        </>
    );
}
