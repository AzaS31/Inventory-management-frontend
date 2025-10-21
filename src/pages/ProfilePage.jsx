import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import InventoryTable from "../components/InventoryTable";
import CategoryManager from "../components/CategoryManager";

export default function ProfilePage() {
    const { user } = useContext(AuthContext);

    if (!user) return <p>Please log in.</p>;

    return (
        <div className="container py-4">
            <h2 className="mb-4">Welcome, {user.username}</h2>

            <div className="mb-4 p-3 border rounded bg-light">
                <h5>User Information</h5>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role?.name || "USER"}</p>
            </div>

            <CategoryManager />

            <h4>My Inventories</h4>
            <InventoryTable type="my" />

            <h4 className="mt-5">Inventories with Access</h4>
            <InventoryTable type="shared" />
        </div>
    );
}
