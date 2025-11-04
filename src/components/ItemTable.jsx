import { useState } from "react";
import { Table, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";

export default function ItemTable({
    items = [],
    customFields = [],
    selectable = false,
    selected = [],
    onSelect = () => { },
    onSelectAll = () => { },
}) {
    const navigate = useNavigate();
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const displayedItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const allSelected =
        displayedItems.length > 0 && selected.length === displayedItems.length;

    const visibleFields = customFields.filter(f => f.showInTable);

    if (!items.length)
        return <p className="text-center text-muted mt-4">No items to display.</p>;

    return (
        <div className="mt-3">
            <Table bordered hover responsive>
                <thead className="table-light">
                    <tr>
                        {selectable && (
                            <th style={{ width: "50px" }}>
                                <Form.Check
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={(e) => onSelectAll(e.target.checked)}
                                />
                            </th>
                        )}
                        <th>#</th>
                        <th>Custom ID</th>
                        <th>Title</th>
                        {visibleFields.map(f => (
                            <th key={f.id}>{f.name}</th>
                        ))}
                        <th>Created By</th>
                        <th>Likes</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedItems.map((item, index) => (
                        <tr
                            key={item.id}
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                                if (e.target.type !== "checkbox") {
                                    navigate(`/inventory/${item.inventoryId}/item/${item.id}`);
                                }
                            }}
                        >
                            {selectable && (
                                <td>
                                    <Form.Check
                                        type="checkbox"
                                        checked={selected.includes(item.id)}
                                        onChange={() => onSelect(item.id)}
                                    />
                                </td>
                            )}
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{item.customId || "-"}</td>
                            <td>{item.name || "(No title)"}</td>
                            {visibleFields.map(f => {
                                const valueObj = item.customValues?.find(v => v.customFieldId === f.id);
                                return (
                                    <td key={f.id}>
                                        {valueObj?.value ?? "-"}
                                    </td>
                                );
                            })}
                            <td>{item.creator?.username || "—"}</td>
                            <td>{item.likesCount || 0}</td>
                            <td>{new Date(item.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="d-flex justify-content-end">
                <Pagination
                    totalItems={items.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}
