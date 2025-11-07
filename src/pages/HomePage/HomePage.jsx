import LatestInventories from "./LatestInventories";
import TopFiveInventories from "./TopFiveInventories";
import Breadcrumbs from "../../components/Breadcrumbs";
import TagClouds from "./TagClouds";

export default function HomePage() {
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Latest Inventories</h2>
            <LatestInventories />
            
            <h2 className="mb-4">Top-5 Inventories</h2>
            <TopFiveInventories />

            <TagClouds />
        </div>
    );
}
