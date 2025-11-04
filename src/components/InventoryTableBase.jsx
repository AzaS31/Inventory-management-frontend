import { useState } from "react";
import { Table, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import ReactMarkdown from "react-markdown";

export default function InventoryTableBase({
    data = [],
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
    const displayedData = data.slice(indexOfFirstItem, indexOfLastItem);

    const allSelected = displayedData.length > 0 && selected.length === displayedData.length;

    if (!data.length)
        return <p className="text-center text-muted mt-4">No inventories to display.</p>;

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
                        <th>Title</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Items</th>
                        <th>Owner</th>
                        <th>Updated At</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedData.map((inv, index) => (
                        <tr
                            key={inv.id}
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                                if (e.target.type !== "checkbox") {
                                    navigate(`/inventory/${inv.id}`);
                                }
                            }}
                        >
                            {selectable && (
                                <td>
                                    <Form.Check
                                        type="checkbox"
                                        checked={selected.includes(inv.id)}
                                        onChange={() => onSelect(inv.id)}
                                    />
                                </td>
                            )}
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{inv.title}</td>
                            <td>{inv.category?.name || "-"}</td>
                            <td>
                                {inv.description ? (
                                    <ReactMarkdown>
                                        {inv.description}
                                    </ReactMarkdown>
                                ) : (
                                    "-"
                                )}
                            </td>
                            <td>{inv._count?.items || 0}</td>
                            <td>
                                {inv.owner ? (
                                    <span
                                        style={{
                                            color: "blue",
                                            textDecoration: "underline",
                                            cursor: "pointer",
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/users/${inv.ownerId}`);
                                        }}
                                    >
                                        {inv.owner.username}
                                    </span>
                                ) : (
                                    "-"
                                )}
                            </td>
                            <td>{new Date(inv.updatedAt).toLocaleString()}</td>
                            <td>{new Date(inv.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="d-flex justify-content-end">
                <Pagination
                    totalItems={data.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}
