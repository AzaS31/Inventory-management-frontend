import { useSalesforce } from "../../context/SalesforceContext";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUsers } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { Container, Form, Button, Spinner, Row, Col } from "react-bootstrap";

export default function SyncWithSalesforceFormPage() {
    const { id: userId } = useParams();
    const { getUserById } = useUsers();
    const [user, setUser] = useState(null);
    const { user: currentUser } = useAuth();
    const { syncWithSalesforce } = useSalesforce();
    const navigate = useNavigate();
    const { notify } = useNotification();

    const [phone, setPhone] = useState("");
    const [mobilePhone, setMobilePhone] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            try {
                const data = await getUserById(userId);
                setUser(data);
            } catch (err) {
                notify(err.message || "Failed to load user");
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUser();
    }, [userId, getUserById]);

    const isOwner = currentUser?.id === userId;

    function navigateBack() {
        if (isOwner) {
            navigate(`/profile`);
        } else {
            navigate(`/users/${userId}`);
        }
    }

    const handleSubmit = async (e) => {
        if (!user) return;

        e.preventDefault();
        setLoadingSubmit(true);
        setError("");

        try {
            const result = await syncWithSalesforce({
                firstName,
                lastName,
                email: user.email,
                title: user.role?.name,
                phone,
                mobilePhone,
            });

            if (result?.alreadySynced) {
                notify("User is already synced with Salesforce");
            } else {
                notify("Synchronization success");
            }

            navigateBack();
        } catch (error) {
            const message = error?.response?.data?.message || error.message || "Synchronization error with Salesforce";
            setError(message);
            notify("Synchronization failed");
        } finally {
            setLoadingSubmit(false);
        }
    };

    if (loadingUser) return <Spinner animation="border" />;
    if (!user) return <p>User not found</p>;

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6}>
                    <h2 className="mb-4 text-center">Synchronization with Salesforce</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>First name</Form.Label>
                            <Form.Control
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" value={user.email} disabled readOnly />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Control type="text" value={user.role?.name} disabled readOnly />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Mobile Phone</Form.Label>
                            <Form.Control
                                type="text"
                                value={mobilePhone}
                                onChange={(e) => setMobilePhone(e.target.value)}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between mt-4">
                            <Button variant="primary" type="submit" disabled={loadingSubmit}>
                                {loadingSubmit ? <Spinner animation="border" size="sm" /> : "Submit"}
                            </Button>
                            <Button variant="secondary" onClick={navigateBack}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}