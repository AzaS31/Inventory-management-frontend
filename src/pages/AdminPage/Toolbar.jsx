import { Button, ButtonGroup, Form } from "react-bootstrap";
import Tooltip from "../../components/Tooltip";

export default function Toolbar({ selectedCount, onRoleChange, onDelete, onBlock, onUnblock }) {
    return (
        <div className="d-flex align-items-center gap-3 mb-3">
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

            <div className="d-flex align-items-center gap-2">
                <Tooltip message="Block selected users" show={selectedCount > 0} showIcon={false}>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={onBlock}
                        disabled={selectedCount === 0}
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "36px", height: "36px" }}
                    >
                        <i className="bi bi-person-dash"></i>
                    </Button>
                </Tooltip>

                <Tooltip message="Unblock selected users" show={selectedCount > 0} showIcon={false}>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={onUnblock}
                        disabled={selectedCount === 0}
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "36px", height: "36px" }}
                    >
                        <i className="bi bi-person-check"></i>
                    </Button>
                </Tooltip>

                <Tooltip message="Delete selected users" show={selectedCount > 0} showIcon={false}>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={onDelete}
                        disabled={selectedCount === 0}
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "36px", height: "36px" }}
                    >
                        <i className="bi bi-trash"></i>
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
}
