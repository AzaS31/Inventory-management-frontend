import { useParams } from "react-router-dom";
import { useUsers } from "../../context/UserContext";
import { useEffect, useState } from "react";
import UserInventories from "./UserInventories";
import SharedWithUserInventories from "./SharedWithUserInventories";
import Notification from "../../components/Notification";
import { useInventory } from "../../context/InventoryContext";

export default function UserProfilePage() {
    const { id } = useParams();
    const { getUserById } = useUsers();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ message: "", type: "info" });
    const { UserInventories, sharedWithUserInventories, fetch } = useInventory();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUserById(id);
                setUser(data);
            } catch (err) {
                setNotification({ message: err.message || "Failed to load user", type: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id, getUserById]);

    if (loading) return <p className="text-center mt-5">Loading...</p>;
    if (!user) return <p className="alert alert-danger mt-5">User not found.</p>;

    return (
        <div className="container py-4">
            <div style={{ position: 'fixed', top: '150px', right: '150px', zIndex: 9999 }}>
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ message: "", type: "info" })}
                />
            </div>

            <h2 className="mb-4">{user.username}'s Profile</h2>

            <div className="mb-4 p-3 border rounded bg-light">
                <h5>User Information</h5>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role?.name || "USER"}</p>
            </div>

            <h4>User Inventories</h4>
            <UserInventories users={userInventories} fetch={fetchUserInventories} />

            <h4 className="mt-5">Inventories with Access</h4>
            <SharedWithUserInventories />
        </div>
    );
}
