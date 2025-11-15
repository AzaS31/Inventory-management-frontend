import { useState, useEffect } from "react";
import { useInventory } from "../../context/InventoryContext";
import { useParams } from "react-router-dom";
import InventoryList from "./InventoryList";
import { useUsers } from "../../context/UserContext";
import { useSalesforce } from "../../context/SalesforceContext";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { useConfirm } from "../../context/ConfirmContext";
import { Button } from "react-bootstrap";

export default function UserProfilePage() {
    const { id: userId } = useParams();
    const { getUserById } = useUsers();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const { userInventories, fetchUserInventories, sharedWithUserInventories, fetchSharedWithUserInventories } = useInventory();
    const { getAuthUrl, unsyncWithSalesforce } = useSalesforce();
    const { notify } = useNotification();
    const confirm = useConfirm();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUserById(userId); setUser(data);
            } catch (err) {
                notify(err);
            } finally {
                setLoading(false);
            }
        }; fetchUser();
    }, [userId, getUserById]);

    const handleUnsyncWithSalesforce = async (e) => {
        try {
            const confirmed = await confirm("Are you sure you want to disconnect your account from Salesforce?");
            if (!confirmed) return;

            await unsyncWithSalesforce(user.email);
            notify("Your account has been successfully disconnected from Salesforce.");
        } catch (error) {
            notify(error);
        }
    }

    if (loading) return <p>Loading user...</p>;
    if (!user) return <p>User not found.</p>;

    const isAdmin = currentUser?.role?.name === "ADMIN";
    const isOwner = currentUser?.id === userId;
    const canEditSalesforce = isAdmin || isOwner;

    return (
        <div className="container py-4">
            <div className="mb-4 p-3 border rounded bg-light">
                <h5>User Information</h5>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role?.name || "USER"}</p>

                {canEditSalesforce && (
                    <>
                        <Button
                            variant="outline-primary"
                            className="m-2"
                            onClick={() => {
                                const url = getAuthUrl(userId);
                                window.location.href = url;
                            }}
                        >
                            Sync with Salesforce
                        </Button>
                        <Button
                            variant="outline-secondary"
                            onClick={() => { handleUnsyncWithSalesforce() }}
                        >
                            Unsync
                        </Button>
                    </>
                )}
            </div>

            <h4 className="mt-5 mb-3">Inventories</h4>
            <InventoryList userId={userId} fetchDataFn={fetchUserInventories} data={userInventories} />

            <h4 className="mt-5 mb-3">Inventories with Access</h4>
            <InventoryList userId={userId} fetchDataFn={fetchSharedWithUserInventories} data={sharedWithUserInventories} />
        </div>
    );
}
