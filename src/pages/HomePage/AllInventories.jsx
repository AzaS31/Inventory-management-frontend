import { useEffect } from "react";
import { useInventory } from "../../context/InventoryContext";
import InventoryTableBase from "../../components/Inventories/InventoryTableBase";

export default function AllInventories() {
    const { allInventories, fetchAllInventories, loading } = useInventory();

    useEffect(() => {
        fetchAllInventories();
    }, []);

    if (loading) return <p>Loading inventories...</p>;

    return (
        <InventoryTableBase data={allInventories} />
    );
}
