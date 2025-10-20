import { useEffect, useState } from "react";
import { useInventory } from "../context/InventoryContext";
import InventoryToolbar from "./InventoryToolbar";

export default function InventoryTable({ type }) {
    const {
        inventories,
        sharedInventories,
        fetchMyInventories,
        fetchSharedInventories,
        deleteInventory,
        loading,
    } = useInventory();

    const [selected, setSelected] = useState([]);

    useEffect(() => {
        if (type === "my") fetchMyInventories();
        if (type === "shared") fetchSharedInventories();
    }, [type]);

    const data = type === "my" ? inventories : sharedInventories;

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selected.length === data.length) {
            setSelected([]);
        } else {
            setSelected(data.map((inv) => inv.id));
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

    if (loading) return <p>Loading...</p>;
    if (!data.length) return <p>No inventories found.</p>;

    return (
        <div className="mt-4">
            <InventoryToolbar
                selectedCount={selected.length}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <div className="table-responsive">
                <table className="table table-striped align-middle">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={selected.length === data.length}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Public</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((inv) => (
                            <tr key={inv.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(inv.id)}
                                        onChange={() => toggleSelect(inv.id)}
                                    />
                                </td>
                                <td>{inv.title}</td>
                                <td>{inv.description}</td>
                                <td>{inv.isPublic ? "Yes" : "No"}</td>
                                <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
