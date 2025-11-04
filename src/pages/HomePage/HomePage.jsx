import AllInventories from "./AllInventories";
import TopFiveInventories from "./TopFiveInventories";

export default function HomePage() {
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Top-5 Inventories</h2>
            <TopFiveInventories />
            <h2 className="mb-4">All Inventories</h2>
            <AllInventories />
        </div>
    );
}
