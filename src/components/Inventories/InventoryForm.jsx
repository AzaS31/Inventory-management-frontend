import { Form, Button } from "react-bootstrap";
import InventoryDetailsFields from "./InventoryDetailsFields";

export default function InventoryForm({
    title,
    description,
    isPublic,
    categoryId,
    categories,
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
                onChange={onChange}
            />

            <div className="d-flex justify-content-between mt-3">
                <Button variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary">
                    Create
                </Button>
            </div>
        </Form>
    );
}
