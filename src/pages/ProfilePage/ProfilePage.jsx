import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import MyInventories from "./MyInventories";
import SharedWithMeInventories from "./SharedWithMeInventories";
import { Button } from "react-bootstrap";
import { useSalesforce } from "../../context/SalesforceContext";
import { useNotification } from "../../context/NotificationContext";
import { useConfirm } from "../../context/ConfirmContext";

export default function ProfilePage() {
    const { user } = useContext(AuthContext);
    const { getAuthUrl, unsyncWithSalesforce } = useSalesforce();
    const { notify } = useNotification();
    const confirm = useConfirm();

    if (!user) return <p>Please log in.</p>;

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

    return (
        <div className="container py-4">
            <h2 className="mb-4">Welcome, {user.username}</h2>

            <div className="mb-4 p-3 border rounded bg-light">
                <h5>User Information</h5>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role?.name || "USER"}</p>

                <Button
                    variant="outline-primary"
                    className="m-2"
                    onClick={() => {
                        const url = getAuthUrl(user.id);
                        window.location.href = url;
                    }}
                >
                    Sync with Salesforce
                </Button>
                <Button
                    variant="outline-secondary"
                    onClick={() => {handleUnsyncWithSalesforce()}}
                >
                    Unsync
                </Button>

            </div>

            <h4 className="mt-5 mb-3">My Inventories</h4>
            <MyInventories />

            <h4 className="mt-5 mb-3">Inventories with Access</h4>
            <SharedWithMeInventories />
        </div>
    );
}
