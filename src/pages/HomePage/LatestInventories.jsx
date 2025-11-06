import { useEffect, useState } from "react";
import { useInventory } from "../../context/InventoryContext";
import InventoryTableBase from "../../components/InventoryTableBase";

export default function LastInventories() {
    const { latestInventories, fetchLatestInventories } = useInventory();
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchLatestInventories();
            setLoading(false);
        };
        fetchData();
    }, [fetchLatestInventories]);

    if (loading) return <p>Loading inventories...</p>;

    return <InventoryTableBase data={latestInventories} />;
}
