import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useUsers } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";
import Toolbar from "./Toolbar";
import UsersTable from "./UsersTable";

export default function AdminPage() {
    const { user, loading } = useContext(AuthContext);
    const { users, fetchAllUsers, changeRole, setActive, deleteUsers, loadingUsers } = useUsers();
    const navigate = useNavigate();

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "info" });

    const showNotification = useCallback((message, type = "info") => {
        setNotification({ message, type });
        const timer = setTimeout(() => setNotification({ message: "", type: "info" }), 5000);
        return () => clearTimeout(timer);
    }, []);

    const toggleSelectUser = (id) => {
        setSelectedUsers(prev =>
            prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(u => u.id));
        }
        setSelectAll(!selectAll);
    };

    useEffect(() => {
        if (!loading) {
            if (!user) return;
            if (user.role?.name !== "ADMIN") {
                navigate("/", { replace: true });
            } else {
                fetchAllUsers().catch(err => showNotification(err.message || "Failed to load users", "error"));
            }
        }
    }, [loading, user, navigate, fetchAllUsers, showNotification]);

    const handleRoleChange = async (roleId) => {
        if (selectedUsers.length === 0) return;
        try {
            const res = await changeRole(selectedUsers, roleId);
            showNotification(`${res.count} user(s) roles updated`, "success");
            setSelectedUsers([]);
        } catch (err) {
            showNotification(err.message || "Failed to update roles", "error");
        }
    };

    const handleDelete = async () => {
        if (selectedUsers.length === 0) return;
        try {
            const res = await deleteUsers(selectedUsers);
            showNotification(`${res.count} user(s) deleted`, "success");
            setSelectedUsers([]);
        } catch (err) {
            showNotification(err.message || "Failed to delete users", "error");
        }
    };

    const handleBlock = async () => {
        if (selectedUsers.length === 0) return;
        try {
            const res = await setActive(selectedUsers, false);
            showNotification(`${res.count} user(s) blocked`, "warning");
            setSelectedUsers([]);
        } catch (err) {
            showNotification(err.message || "Failed to block users", "error");
        }
    };

    const handleUnblock = async () => {
        if (selectedUsers.length === 0) return;
        try {
            const res = await setActive(selectedUsers, true);
            showNotification(`${res.count} user(s) unblocked`, "success");
            setSelectedUsers([]);
        } catch (err) {
            showNotification(err.message || "Failed to unblock users", "error");
        }
    };

    if (loading || loadingUsers) {
        return <p className="text-center mt-5">Loading...</p>;
    }

    if (!user || user.role?.name !== "ADMIN") {
        return <p className="alert alert-danger text-center mt-5">Redirecting... Access Denied.</p>;
    }

    return (
        <div className="container mt-5">
            <div style={{ position: 'fixed', top: '150px', right: '150px', zIndex: 9999 }}>
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ message: "", type: "info" })}
                />
            </div>

            <h3 className="mb-4 text-center">Users</h3>

            <Toolbar
                selectedCount={selectedUsers.length}
                onRoleChange={handleRoleChange}
                onDelete={handleDelete}
                onBlock={handleBlock}
                onUnblock={handleUnblock}
            />

            <UsersTable
                users={users}
                selectedUsers={selectedUsers}
                onToggleUser={toggleSelectUser}
                onToggleAll={toggleSelectAll}
                selectAll={selectAll}
            />
        </div>
    );
}
