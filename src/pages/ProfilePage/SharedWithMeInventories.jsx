import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useInventory } from "../../context/InventoryContext";
import InventoryTableBase from "../../components/Inventories/InventoryTableBase";
import { Button } from "react-bootstrap";

export default function SharedWithMeInventories() {
    const { sharedWithMeInventories, fetchSharedWithMeInventories, loading } = useInventory();
    const [selected, setSelected] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSharedWithMeInventories();
    }, []);

    const handleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = (checked) => {
        setSelected(checked ? sharedWithMeInventories.map((i) => i.id) : []);
    };

    const handleEdit = () => {
        if (selected.length === 1) {
            navigate(`/inventories/${selected[0]}/edit`);
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
            <div className="d-flex justify-content-start mb-2">
                <Button
                    variant="outline-secondary"
                    onClick={handleEdit}
                    disabled={selected.length !== 1}
                >
                    Edit
                </Button>
            </div>

            <InventoryTableBase
                data={sharedWithMeInventories}
                selectable
                selected={selected}
                onSelect={handleSelect}
                onSelectAll={handleSelectAll}
            />
        </>
    );
}
