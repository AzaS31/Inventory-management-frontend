import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import MyInventories from "./MyInventories";
import SharedWithMeInventories from "./SharedWithMeInventories";

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

            <h4 className="mt-5 mb-3">My Inventories</h4>
            <MyInventories />

            <h4 className="mt-5 mb-3">Inventories with Access</h4>
            <SharedWithMeInventories />
        </div>
    );
}
