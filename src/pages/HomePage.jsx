import InventoryTable from "../components/InventoryTable";

export default function HomePage() {
    return (
        <div className="container mt-4">
            <h2 className="mb-4">All Inventories</h2>
            <InventoryTable type="all" />
        </div>
    );
}
