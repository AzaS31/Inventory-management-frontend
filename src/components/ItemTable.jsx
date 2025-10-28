import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Table } from "react-bootstrap";
import Pagination from "./Pagination";

export default function ItemTable({ items = [], onSelectionChange }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const itemsPerPage = 5;

    const totalItems = items.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagedItems = items.slice(startIndex, endIndex);

    const handleSelect = (id) => {
        setSelectedIds((prev) => {
            const newSelection = prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id];

            onSelectionChange?.(newSelection);
            return newSelection;
        });
    };

    const handleSelectAll = (e) => {
        let newSelection = [];
        if (e.target.checked) {
            newSelection = pagedItems.map((i) => i.id);
        }
        setSelectedIds(newSelection);
        onSelectionChange?.(newSelection);
    };

    return (
        <div>
   <Table bordered hover responsive>
    <thead>
        <tr>
            <th style={{ width: "40px" }}>
                <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                        pagedItems.length > 0 &&
                        selectedIds.length === pagedItems.length
                    }
                />
            </th>
            <th>Custom ID</th>
            <th>Title</th>
            <th>Created By</th>
            <th>Likes</th>
            <th>Status</th>
            <th>Created At</th>
        </tr>
    </thead>
    <tbody>
        {pagedItems.length === 0 ? (
            <tr>
                <td colSpan={7} className="text-center text-muted py-3">
                    No items found
                </td>
            </tr>
        ) : (
            pagedItems.map((item) => (
                <tr
                    key={item.id}
                    onClick={(e) => {
                         if (e.target.type !== "checkbox") {
                                    navigate(`/inventory/${item.inventoryId}/item/${item.id}`);
                                }
                    }} 
                    className={
                        selectedIds.includes(item.id)
                            ? "table-primary"
                            : ""
                    }
                    style={{ cursor: "pointer" }} 
                >
                    <td>
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={() => handleSelect(item.id)}
                            onClick={(e) => {
                                e.stopPropagation(); 
                                handleSelect(item.id);
                            }}
                        />
                    </td>
                    <td>{item.customId}</td>
                    <td>{item.name || "(No title)"}</td>
                    <td>{item.creator?.username || "—"}</td>
                    <td>{item.likesCount || 0}</td>
                    <td>{item.status}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
            ))
        )}
    </tbody>
</Table>

            <Pagination
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}
