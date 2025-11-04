import { Button, ButtonGroup, Dropdown, Form } from "react-bootstrap";

export default function Toolbar({ selectedCount, onRoleChange, onDelete, onBlock, onUnblock }) {
    return (
        <div className="d-flex align-items-center gap-2 mb-3">
            <span className="text-muted small">Selected: {selectedCount}</span>

            <Form.Select
                className="w-auto"
                onChange={(e) => onRoleChange(Number(e.target.value))}
                defaultValue=""
                disabled={selectedCount === 0}
            >
                <option value="" disabled>
                    Change role
                </option>
                <option value={1}>CREATOR</option>
                <option value={2}>ADMIN</option>
            </Form.Select>

            <ButtonGroup>
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={onBlock}
                    disabled={selectedCount === 0}
                >
                    Block
                </Button>
                <Button
                    variant="outline-success"
                    size="sm"
                    onClick={onUnblock}
                    disabled={selectedCount === 0}
                >
                    Unblock
                </Button>
                <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={onDelete}
                    disabled={selectedCount === 0}
                >
                    Delete selected
                </Button>
            </ButtonGroup>
        </div>
    );
}
