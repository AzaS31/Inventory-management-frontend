import { useEffect, useState } from "react";
import { Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useInventory } from "../../context/InventoryContext";
import InventoryTableBase from "../../components/InventoryTableBase";
import { useAuth } from "../../context/AuthContext";
import { useConfirm } from "../../context/ConfirmContext";
import { useNotification } from "../../context/NotificationContext";

export default function SharedWithMeInventories() {
    const { sharedWithMeInventories, fetchSharedWithMeInventories, deleteInventoriesBatch } = useInventory();
    const { user } = useAuth();
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();
    const confirm = useConfirm();
    const { notify } = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchSharedWithMeInventories();
            setLoading(false);
        };
        fetchData();
    }, [fetchSharedWithMeInventories]);

    const handleSelect = (id) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (checked) => {
        setSelected(checked ? sharedWithMeInventories.map(i => i.id) : []);
    };

    const handleEdit = () => {
        if (selected.length === 1) {
            navigate(`/inventory/${selected[0]}?tab=general`);
        }
    };

    const handleDelete = async () => {
        if (selected.length === 0) return;

        const ok = await confirm(
            "Are you sure you want to delete the selected inventory(s)?"
        );

        if (!ok) return;

        setDeleting(true);
        try {
            await deleteInventoriesBatch(selected);
            notify("Selected inventories removed");
            setSelected([]);
            await fetchSharedWithMeInventories();
        } catch (error) {
            console.error(error);
            notify("Failed to delete inventories", "error");
        } finally {
            setDeleting(false);
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
            {sharedWithMeInventories.length > 0 && (
                <div className="d-flex justify-content-start mb-2 gap-2">
                    <Button
                        variant="outline-secondary"
                        onClick={handleEdit}
                        disabled={selected.length !== 1}
                    >
                        Edit
                    </Button>

                    {user?.role?.name === "ADMIN" && (
                        <Button
                            variant="outline-danger"
                            onClick={handleDelete}
                            disabled={selected.length === 0 || deleting}
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    )}
                </div>
            )}

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
