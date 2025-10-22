export default function Toolbar({ selectedCount, onRoleChange, onDelete, onBlock, onUnblock }) {
    return (
        <div className="d-flex gap-2 mb-3 align-items-center">
            <span className="text-muted small me-2">Selected: {selectedCount}</span>

            <select
                className="form-select w-auto"
                onChange={(e) => onRoleChange(Number(e.target.value))}
                defaultValue=""
                disabled={selectedCount === 0}
            >
                <option value="" disabled>Change role</option>
                <option value={1}>CREATOR</option>
                <option value={2}>ADMIN</option>
            </select>

            <button
                className="btn btn-outline-secondary btn-sm"
                onClick={onBlock}
                disabled={selectedCount === 0}
            >
                Block
            </button>

            <button
                className="btn btn-outline-success btn-sm"
                onClick={onUnblock}
                disabled={selectedCount === 0}
            >
                Unblock
            </button>

            <button
                className="btn btn-outline-danger btn-sm"
                onClick={onDelete}
                disabled={selectedCount === 0}
            >
                Delete selected
            </button>
        </div>
    );
}
