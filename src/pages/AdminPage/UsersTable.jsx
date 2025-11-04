import { Table, Form, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function UsersTable({
    users = [],
    selectedUsers = [],
    onToggleUser = () => { },
    onToggleAll = () => { },
    selectAll = false,
}) {
    const navigate = useNavigate();

    const getRoleName = (roleId) => {
        switch (roleId) {
            case 1:
                return "CREATOR";
            case 2:
                return "ADMIN";
            default:
                return "N/A";
        }
    };

    const getStatusBadge = (isActive) => {
        return isActive ? (
            <Badge bg="success">Active</Badge>
        ) : (
            <Badge bg="secondary">Inactive</Badge>
        );
    };

    return (
        <Table bordered hover responsive className="align-middle text-center">
            <thead className="table-light">
                <tr>
                    <th style={{ width: "50px" }}>
                        <Form.Check
                            type="checkbox"
                            checked={selectAll}
                            onChange={onToggleAll}
                        />
                    </th>
                    <th>#</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, index) => (
                    <tr
                        key={user.id}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                            if (e.target.type !== "checkbox") {
                                navigate(`/users/${user.id}`);
                            }
                        }}
                    >
                        <td>
                            <Form.Check
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => onToggleUser(user.id)}
                            />
                        </td>
                        <td>{index + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{getRoleName(user.roleId)}</td>
                        <td>{getStatusBadge(user.isActive)}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
