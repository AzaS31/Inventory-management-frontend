import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useInventory } from "../../context/InventoryContext";
import InventoryTableBase from "../../components/InventoryTableBase";
import TableToolbar from "../../components/TableToolbar";

export default function MyInventories() {
    const { myInventories, fetchMyInventories, deleteInventoriesBatch, loading } = useInventory();
    const [selected, setSelected] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyInventories();
    }, []);

    const handleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = (checked) => {
        setSelected(checked ? myInventories.map((i) => i.id) : []);
    };

    const handleCreate = () => navigate("/inventory/create");

    const handleEdit = () => {
        if (selected.length === 1) {
            navigate(`/inventories/${selected[0]}?tab=general`);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteInventoriesBatch(selected);
            setSelected([]);
        } catch (error) {
            console.error("Failed to delete inventories:", error);
        }
    };

    if (loading)
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );

    return (
        <>
            <TableToolbar
                selectedCount={selected.length}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <InventoryTableBase
                data={myInventories}
                selectable
                selected={selected}
                onSelect={handleSelect}
                onSelectAll={handleSelectAll}
            />
        </>
    );
}
