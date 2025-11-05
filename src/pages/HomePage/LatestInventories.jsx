import { useEffect } from "react";
import { useInventory } from "../../context/InventoryContext";
import InventoryTableBase from "../../components/InventoryTableBase";

export default function AllInventories() {
    const { latestInventories, fetchLatestInventories, loading } = useInventory();

    useEffect(() => {
        fetchLatestInventories();
    }, []);

    if (loading) return <p>Loading inventories...</p>;

    return (
        <InventoryTableBase data={latestInventories} />
    );
}
