import { useEffect, useState } from "react";
import { useInventory } from "../../context/InventoryContext";
import InventoryTableBase from "../../components/InventoryTableBase";

export default function TopFiveInventories() {
    const { topFiveInventories, fetchTopFiveInventories } = useInventory();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchTopFiveInventories();
            setLoading(false);
        };
        fetchData();
    }, [fetchTopFiveInventories]);

    if (loading) return <p>Loading inventories...</p>;

    return <InventoryTableBase data={topFiveInventories} />;
}
