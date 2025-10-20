export default function InventoryToolbar({ selectedCount, onCreate, onEdit, onDelete }) {
    return (
        <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
                <button className="btn btn-success" onClick={onCreate}>
                    Create
                </button>

                <button
                    className="btn btn-primary ms-2"
                    onClick={onEdit}
                    disabled={selectedCount !== 1}
                >
                    Edit
                </button>

                <button
                    className="btn btn-danger ms-2"
                    onClick={onDelete}
                    disabled={selectedCount === 0}
                >
                    Delete
                </button>
            </div>

            <small className="text-muted">
                {selectedCount > 0
                    ? `${selectedCount} selected`
                    : "No inventories selected"}
            </small>
        </div>
    );
}
