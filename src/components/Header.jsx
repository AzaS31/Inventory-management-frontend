import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { Navbar, Nav, Container, Button, Form, InputGroup } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';


export default function Header() {
    const { user, logout, loading } = useAuth();
    const { search } = useSearch();
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    if (loading) return null;

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        await search(query);
        navigate(`/search?q=${encodeURIComponent(query)}`);
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Home
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Form className="d-flex me-3" onSubmit={handleSearch}>
                            <InputGroup>
                                <Form.Control
                                    type="search"
                                    placeholder="Search..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <Button type="submit" variant="light">
                                    <i className="bi bi-search"></i>
                                </Button>
                            </InputGroup>
                        </Form>

                        {!user && (
                            <>
                                <Button as={Link} to="/login" variant="outline-light" className="me-2">
                                    Login
                                </Button>
                                <Button as={Link} to="/register" variant="warning">
                                    Sign-up
                                </Button>
                            </>
                        )}

                        {user && (
                            <>
                                <span className="text-white me-2">{user.username}</span>

                                <div
                                    className="rounded-circle bg-secondary d-flex align-items-center justify-content-center me-2"
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        color: "white",
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {user.username[0]}
                                </div>

                                <Button as={Link} to="/profile" variant="outline-light" className="me-2">
                                    Profile
                                </Button>

                                {user.role?.name === "ADMIN" && (
                                    <Button as={Link} to="/admin" variant="outline-light" className="me-2">
                                        Admin Panel
                                    </Button>
                                )}

                                <Button variant="warning" onClick={logout}>
                                    Logout
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
