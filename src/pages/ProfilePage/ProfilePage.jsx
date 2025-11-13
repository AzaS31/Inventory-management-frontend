import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import MyInventories from "./MyInventories";
import SharedWithMeInventories from "./SharedWithMeInventories";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function ProfilePage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!user) return <p>Please log in.</p>;

    return (
        <div className="container py-4">
            <h2 className="mb-4">Welcome, {user.username}</h2>

            <div className="mb-4 p-3 border rounded bg-light">
                <h5>User Information</h5>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role?.name || "USER"}</p>
                <Button variant="outline-primary" onClick={() => navigate("/salesforce/sync")}>Sync with Salesforce</Button>
            </div>

            <h4 className="mt-5 mb-3">My Inventories</h4>
            <MyInventories />

            <h4 className="mt-5 mb-3">Inventories with Access</h4>
            <SharedWithMeInventories />
        </div>
    );
}
