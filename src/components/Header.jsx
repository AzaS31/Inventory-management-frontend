import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { useTags } from "../context/TagContext";
import { Navbar, Nav, Container, Button, Form, InputGroup, ListGroup } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Header() {
    const { user, logout, loading } = useAuth();
    const { search } = useSearch();
    const { searchTags } = useTags();
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        const timeout = setTimeout(async () => {
            const data = await searchTags(query);
            setSuggestions(data);
        }, 250);

        return () => clearTimeout(timeout);
    }, [query]);

    if (loading) return null;

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        await search(query);
        navigate(`/search?q=${encodeURIComponent(query)}`);
        setShowSuggestions(false);
    };

    const handleSelect = (tagName) => {
        navigate(`/search?q=${encodeURIComponent(tagName)}`);
        setShowSuggestions(false);
        setQuery(tagName);
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        Home
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="main-navbar" />
                    <Navbar.Collapse id="main-navbar">
                        <Nav className="me-auto align-items-lg-center">
                            {user && (
                                <>
                                    <Nav.Link as={Link} to="/profile">
                                        Profile
                                    </Nav.Link>

                                    {user.role?.name === "ADMIN" && (
                                        <Nav.Link as={Link} to="/admin">
                                            Admin Panel
                                        </Nav.Link>
                                    )}
                                </>
                            )}
                        </Nav>

                        <Nav className="ms-auto align-items-lg-center">
                            {!user ? (
                                <>
                                    <Button
                                        as={Link}
                                        to="/login"
                                        variant="outline-light"
                                        className="me-lg-2 mb-2 mb-lg-0"
                                    >
                                        Login
                                    </Button>
                                    <Button as={Link} to="/register" variant="warning" className="mb-2 mb-lg-0">
                                        Sign-up
                                    </Button>
                                </>
                            ) : (
                                <div className="d-flex flex-column flex-lg-row align-items-lg-center">
                                    <div className="d-flex align-items-center mb-2 mb-lg-0 me-lg-2 text-nowrap">
                                        <span className="text-white me-2">{user.username}</span>
                                        <div
                                            className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
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
                                    </div>
                                    <Button variant="warning" onClick={logout} className="mb-2 mb-lg-0">
                                        Logout
                                    </Button>
                                </div>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Navbar
                bg="white"
                variant="light"
                className="py-2 shadow-none border-bottom"
            >
                <Container className="justify-content-start">
                    <Form
                        className="search-form d-flex position-relative"
                        onSubmit={handleSearch}
                        autoComplete="off"
                        style={{ maxWidth: "400px", width: "100%" }}
                    >
                        <InputGroup>
                            <Form.Control
                                type="search"
                                placeholder="Search..."
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                className="search-input"
                            />
                            <Button type="submit" variant="outline-secondary">
                                <i className="bi bi-search"></i>
                            </Button>
                        </InputGroup>

                        {showSuggestions && suggestions.length > 0 && (
                            <ListGroup
                                className="position-absolute w-100 shadow-sm"
                                style={{
                                    top: "100%",
                                    zIndex: 10,
                                    backgroundColor: "white",
                                    borderRadius: "0.25rem",
                                    maxHeight: "250px",
                                    overflowY: "auto",
                                }}
                            >
                                {suggestions.map((tag) => (
                                    <ListGroup.Item
                                        key={tag.id}
                                        action
                                        onClick={() => handleSelect(tag.name)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <i className="bi bi-tag text-secondary me-2"></i>
                                        {tag.name}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Form>
                </Container>
            </Navbar>

        </>

    );

}