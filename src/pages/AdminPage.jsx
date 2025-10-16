import { useEffect, useState } from "react";
import api from "../api/axios";
import Notification from "../components/Notification";
import Toolbar from "../components/Toolbar";
import UsersTable from "../components/UsersTable";

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "info" });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get("/users");
            setUsers(res.data);
            setSelectedUsers([]);
            setSelectAll(false);
        } catch (err) {
            showNotification("Failed to load users.", "error");
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = "info") => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: "", type: "info" }), 5000);
    };

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

    const handleRoleChange = async (roleId) => {
        if (selectedUsers.length === 0) return;
        try {
            await api.put("/users/role", { userIds: selectedUsers, roleId });
            showNotification("Roles updated successfully.", "success");
            fetchUsers();
        } catch (err) {
            showNotification("Failed to update roles.", "error");
        }
    };

    const handleDelete = async () => {
        if (selectedUsers.length === 0) return;
        try {
            for (const id of selectedUsers) {
                await api.delete(`/users/${id}`);
            }
            showNotification("Users deleted successfully.", "success");
            fetchUsers();
        } catch (err) {
            showNotification("Failed to delete users.", "error");
        }
    };

    if (loading) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div className="container mt-5">
            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: "", type: "info" })}
            />
            <h3 className="mb-4 text-center">Users</h3>

            <Toolbar
                selectedCount={selectedUsers.length}
                onRoleChange={handleRoleChange}
                onDelete={handleDelete}
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
