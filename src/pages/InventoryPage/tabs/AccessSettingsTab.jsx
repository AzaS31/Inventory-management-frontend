import { useEffect, useState } from "react";
import { Table, Form, Button, Spinner, Alert } from "react-bootstrap";
import { useInventoryAccess } from "../../../context/InventoryAccessContext";

const AccessSettingsTab = ({ inventory }) => {
    const { accessList, loading, error, fetchAccessList, grantAccess, revokeAccess } =
        useInventoryAccess();

    const [email, setEmail] = useState("");
    const [addError, setAddError] = useState(null);
    const [addLoading, setAddLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        if (!inventory?.id) return;
        fetchAccessList(inventory.id);
    }, [inventory?.id]);

    const handleAddUser = async () => {
        setAddLoading(true);
        setAddError(null);
        try {
            await grantAccess(inventory.id, email);
            setEmail("");
        } catch (err) {
            console.error(err);
            setAddError(err.message);
        } finally {
            setAddLoading(false);
        }
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedUsers(accessList.map((a) => a.user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleRemoveSelected = async () => {
        if (selectedUsers.length === 0) return;
        if (!window.confirm(`Remove ${selectedUsers.length} user(s)?`)) return;

        try {
            for (const userId of selectedUsers) {
                await revokeAccess(inventory.id, userId);
            }
            setSelectedUsers([]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h5>Write Access Settings for: {inventory.title}</h5>

            <Form className="d-flex mb-3" onSubmit={(e) => e.preventDefault()}>
                <Form.Control
                    type="email"
                    placeholder="User email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                    className="ms-2"
                    onClick={handleAddUser}
                    disabled={addLoading}
                >
                    {addLoading ? <Spinner size="sm" animation="border" /> : "Add"}
                </Button>
            </Form>
            {addError && <Alert variant="danger">{addError}</Alert>}

            {loading ? (
                <Spinner animation="border" />
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <>
                    {accessList.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleRemoveSelected}
                                disabled={selectedUsers.length === 0}
                            >
                                Delete
                            </Button>
                            <div className="text-muted small">
                                Selected: {selectedUsers.length}
                            </div>
                        </div>
                    )}
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th style={{ width: "40px" }}>
                                    <Form.Check
                                        type="checkbox"
                                        onChange={(e) =>
                                            handleSelectAll(e.target.checked)
                                        }
                                        checked={
                                            selectedUsers.length === accessList.length &&
                                            accessList.length > 0
                                        }
                                    />
                                </th>
                                <th style={{ width: "50px" }}>#</th>
                                <th>Username</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accessList.map((access, index) => (
                                <tr key={access.user.id}>
                                    <td className="text-center">
                                        <Form.Check
                                            type="checkbox"
                                            checked={selectedUsers.includes(access.user.id)}
                                            onChange={() => handleSelectUser(access.user.id)}
                                        />
                                    </td>
                                    <td>{index + 1}</td>
                                    <td>{access.user.username}</td>
                                    <td>{access.user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
        </div>
    );
};

export default AccessSettingsTab;
