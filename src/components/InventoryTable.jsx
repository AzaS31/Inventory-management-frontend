import { useEffect, useState } from "react";
import { useInventory } from "../context/InventoryContext";
import InventoryToolbar from "./InventoryToolbar";
import Pagination from "./Pagination";
import { Table, Form, Spinner } from "react-bootstrap";

export default function InventoryTable({ type }) {
    const {
        myInventories,
        sharedInventories,
        allInventories,
        fetchMyInventories,
        fetchSharedInventories,
        fetchAllInventories,
        deleteInventory,
        loading,
    } = useInventory();

    const [selected, setSelected] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (type === "my") fetchMyInventories();
        else if (type === "shared") fetchSharedInventories();
        else if (type === "all") fetchAllInventories();
    }, [type]);

    const data =
        type === "my"
            ? myInventories
            : type === "shared"
                ? sharedInventories
                : allInventories || [];

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const displayedData = data.slice(indexOfFirstItem, indexOfLastItem);

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selected.length === displayedData.length) {
            setSelected([]);
        } else {
            setSelected(displayedData.map((inv) => inv.id));
        }
    };

    const handleCreate = () => {
        alert("Open Create Inventory Modal");
    };

    const handleEdit = () => {
        if (selected.length !== 1) return;
        const id = selected[0];
        alert(`Open Edit Modal for inventory ID: ${id}`);
    };

    const handleDelete = async () => {
        for (const id of selected) {
            await deleteInventory(id);
        }
        setSelected([]);
    };

    if (loading)
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );

    if (!data.length)
        return (
            <p className="text-center text-muted mt-4">
                No inventories found.
            </p>
        );

    return (
        <div className="mt-4">
            <InventoryToolbar
                selectedCount={selected.length}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Table striped bordered hover responsive>
                <thead className="table-light">
                    <tr>
                        <th>
                            <Form.Check
                                type="checkbox"
                                checked={
                                    selected.length === displayedData.length &&
                                    displayedData.length > 0
                                }
                                onChange={handleSelectAll}
                            />
                        </th>
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
                        <tr key={inv.id}>
                            <td>
                                <Form.Check
                                    type="checkbox"
                                    checked={selected.includes(inv.id)}
                                    onChange={() => toggleSelect(inv.id)}
                                />
                            </td>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{inv.title}</td>
                            <td>{inv.category?.name || "-"}</td>
                            <td>{inv.description}</td>
                            <td>{inv._count?.items || 0}</td>
                            <td>{inv.owner?.username || "-"}</td>
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
