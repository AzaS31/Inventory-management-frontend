import { Table, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function UsersTable({
    users = [],
    selectedUsers = [],
    onToggleUser = () => { },
    onToggleAll = () => { },
    selectAll = false,
}) {
    const navigate = useNavigate();

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
                {users.map((u, i) => (
                    <tr
                        key={u.id}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                            if (e.target.type !== "checkbox") {
                                navigate(`/users/${u.id}`);
                            }
                        }}
                    >
                        <td>
                            <Form.Check
                                type="checkbox"
                                checked={selectedUsers.includes(u.id)}
                                onChange={() => onToggleUser(u.id)}
                            />
                        </td>
                        <td>{i + 1}</td>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>
                            {u.roleId === 1
                                ? "CREATOR"
                                : u.roleId === 2
                                    ? "ADMIN"
                                    : "N/A"}
                        </td>
                        <td>{u.isActive ? "Active" : "Inactive"}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
