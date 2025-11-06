import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useInventory } from "../../context/InventoryContext";
import InventoryTableBase from "../../components/InventoryTableBase";
import TableToolbar from "../../components/TableToolbar";
import InventorySort from "../../components/InventorySort";

export default function MyInventories() {
    const { myInventories, fetchMyInventories, fetchSortedInventories, deleteInventoriesBatch } = useInventory();
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortOption, setSortOption] = useState("title-asc");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchMyInventories();
            setLoading(false);
        };
        fetchData();
    }, [fetchMyInventories]);

    const handleSelect = (id) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (checked) => {
        setSelected(checked ? myInventories.map(i => i.id) : []);
    };

    const handleSort = (newSortBy, newOrder) => {
        setSortOption(`${newSortBy}-${newOrder}`);
        fetchSortedInventories(newSortBy, newOrder);
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
            <InventorySort sortOption={sortOption} onSort={handleSort} />
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
