import { useEffect } from "react";
import { useInventory } from "../../context/InventoryContext";
import InventoryTableBase from "../../components/InventoryTableBase";

export default function AllInventories() {
    const { topFiveInventories, fetchTopFiveInventories, loading } = useInventory();

    useEffect(() => {
        fetchTopFiveInventories();
    }, []);

    if (loading) return <p>Loading inventories...</p>;

    return (
        <InventoryTableBase data={topFiveInventories} />
    );
}
