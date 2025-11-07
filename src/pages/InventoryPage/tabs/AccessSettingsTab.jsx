import { useEffect, useState } from "react";
import { Table, Form, Button, Spinner, Alert, ListGroup } from "react-bootstrap";
import { useInventoryAccess } from "../../../context/InventoryAccessContext";
import { useConfirm } from "../../../context/ConfirmContext";

const AccessSettingsTab = ({ inventory }) => {
    const {
        accessList,
        loading,
        error,
        fetchAccessList,
        grantAccess,
        revokeAccess,
        searchResults,
        searchUsers,
    } = useInventoryAccess();

    const confirm = useConfirm();

    const [query, setQuery] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [addError, setAddError] = useState(null);
    const [addLoading, setAddLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        if (inventory?.id) fetchAccessList(inventory.id);
    }, [inventory?.id, fetchAccessList]);

    useEffect(() => {
        if (query.trim().length >= 2) {
            const delay = setTimeout(() => searchUsers(query.trim()), 400);
            return () => clearTimeout(delay);
        }
    }, [query, searchUsers]);

    const handleAddUser = async (identifier) => {
        setAddLoading(true);
        setAddError(null);
        try {
            await grantAccess(inventory.id, identifier);
            await fetchAccessList(inventory.id);
            setQuery("");
            setShowResults(false);
        } catch (err) {
            console.error(err);
            setAddError(err.response?.data?.message || "Failed to add access");
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
        setSelectedUsers(checked ? accessList.map((a) => a.user.id) : []);
    };

    const handleRemoveSelected = async () => {
        if (selectedUsers.length === 0) return;

        const ok = await confirm(`Remove ${selectedUsers.length} user(s)?`);
        if (!ok) return;

        try {
            for (const userId of selectedUsers) {
                await revokeAccess(inventory.id, userId);
            }
            await fetchAccessList(inventory.id);
            setSelectedUsers([]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h5 className="mb-3">Write Access Settings for: {inventory.title}</h5>

            <Form
                className="position-relative mb-3"
                onSubmit={(e) => e.preventDefault()}
                autoComplete="off"
            >
                <div className="d-flex">
                    <Form.Control
                        type="text"
                        placeholder="Search user by email or username"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowResults(true);
                        }}
                        onBlur={() => setTimeout(() => setShowResults(false), 150)} 
                    />
                    <Button
                        className="ms-2"
                        disabled={addLoading || !query.trim()}
                        onClick={() => handleAddUser(query.trim())}
                    >
                        {addLoading ? <Spinner size="sm" animation="border" /> : "Add"}
                    </Button>
                </div>

                {showResults && searchResults.length > 0 && (
                    <ListGroup
                        className="position-absolute w-100 mt-1 shadow-sm"
                        style={{ zIndex: 10 }}
                    >
                        {searchResults.map((user) => (
                            <ListGroup.Item
                                key={user.id}
                                action
                                onMouseDown={() => handleAddUser(user.email)} // onMouseDown, чтобы не срабатывал blur раньше
                            >
                                <div>
                                    <strong>{user.username}</strong>{" "}
                                    <span className="text-muted">({user.email})</span>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Form>

            {addError && <Alert variant="danger">{addError}</Alert>}

            {loading ? (
                <div className="text-center py-4">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : accessList.length === 0 ? (
                <Alert variant="secondary">No users with access yet.</Alert>
            ) : (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={handleRemoveSelected}
                            disabled={selectedUsers.length === 0}
                        >
                            Delete Selected
                        </Button>
                        <div className="text-muted small">
                            Selected: {selectedUsers.length}
                        </div>
                    </div>

                    <Table bordered hover responsive>
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
