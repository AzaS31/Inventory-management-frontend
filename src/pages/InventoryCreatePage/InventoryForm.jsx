import { Form, Button } from "react-bootstrap";
import InventoryDetailsFields from "./InventoryDetailsFields";

export default function InventoryForm({
    title,
    description,
    isPublic,
    categoryId,
    categories,
    customIdFormat,
    onChange,
    onSubmit,
    onCancel,
}) {
    return (
        <Form onSubmit={onSubmit}>
            <InventoryDetailsFields
                title={title}
                description={description}
                isPublic={isPublic}
                categoryId={categoryId}
                categories={categories}
                customIdFormat={customIdFormat}
                onChange={onChange}
            />

            <div className="d-flex justify-content-between mt-3">
                <Button type="submit" variant="primary">
                    Create
                </Button>
                <Button variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </Form>
    );
}
