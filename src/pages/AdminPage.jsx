import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Notification from "../components/Notification";
import Toolbar from "../components/Toolbar";
import UsersTable from "../components/UsersTable";
import api from "../api/axios";

export default function AdminPage() {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "info" });
    const [loadingUsers, setLoadingUsers] = useState(false);

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

    const fetchUsers = useCallback(async () => {
        setLoadingUsers(true);
        try {
            const res = await api.get("/users");
            setUsers(res.data);
            setSelectedUsers([]);
            setSelectAll(false);
        } catch (err) {
            showNotification(err.response?.data?.message || err.message || "Failed to load users.", "error");
        } finally {
            setLoadingUsers(false);
        }
    }, [showNotification]);

    useEffect(() => {
        if (!loading) {
            if (!user) return;
            if (user.role?.name !== "ADMIN") {
                navigate("/", { replace: true });
            } else {
                fetchUsers();
            }
        }
    }, [loading, user, navigate, fetchUsers]);

    const handleRoleChange = async (roleId) => {
        if (selectedUsers.length === 0) return;
        try {
            const res = await api.put("/users/role", { userIds: selectedUsers, roleId });
            showNotification(`${res.data.count} user(s) roles updated`, "success");
            fetchUsers();
        } catch (err) {
            showNotification(err.response?.data?.message || "Failed to update roles", "error");
        }
    };

    const handleDelete = async () => {
        if (selectedUsers.length === 0) return;
        try {
            const res = await api.post("/users/delete", { userIds: selectedUsers });
            showNotification(`${res.data.count} user(s) deleted`, "success");
            setSelectedUsers([]);
            fetchUsers();
        } catch (err) {
            showNotification(err.response?.data?.message || "Failed to delete users", "error");
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
            <div style={{
                position: 'fixed',
                top: '150px',
                right: '150px',
                zIndex: 9999
            }}>
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
