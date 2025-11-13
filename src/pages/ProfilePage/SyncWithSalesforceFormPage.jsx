import { useSalesforce } from "../../context/SalesforceContext";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import { Container, Form, Button, Spinner } from "react-bootstrap";

export default function SyncWithSalesforceFormPage() {
    const { syncWithSalesforce } = useSalesforce();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { notify } = useNotification();

    const [phone, setPhone] = useState("");
    const [mobilePhone, setMobilePhone] = useState("");
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await syncWithSalesforce({
                firstName: user.username,
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

            navigate("/profile");
        } catch (error) {
            const message = error.response?.data?.message || "Synchronization error with Salesforce";
            setError(message);
            notify("Synchronization failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Synchronization with Salesforce</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                        type="text"
                        value={user.username}
                        disabled
                        readOnly
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhone">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        value={user.email}
                        disabled
                        readOnly
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                        type="text"
                        value={user.role?.name}
                        disabled
                        readOnly
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formMobilePhone">
                    <Form.Label>Mobile Phone</Form.Label>
                    <Form.Control
                        type="text"
                        value={mobilePhone}
                        onChange={(e) => setMobilePhone(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
                </Button>
            </Form>
        </Container >
    )
}