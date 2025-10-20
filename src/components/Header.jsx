import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
    const { user, logout, loading } = useContext(AuthContext);

    if (loading) return null;

    return (
        <header>
            <div className="px-3 py-2 text-bg-dark border-bottom">
                <div className="container d-flex justify-content-between align-items-center">
                    <div>
                        <Link to="/" className="nav-link text-white fs-5">
                            Home
                        </Link>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        {!user && (
                            <>
                                <Link to="/login" className="btn btn-outline-light">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-warning">
                                    Sign-up
                                </Link>
                            </>
                        )}

                        {user && (
                            <>
                                <span className="text-white">Hi, {user.username}</span>

                                <div
                                    className="rounded-circle bg-secondary"
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white",
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {user.username[0]}
                                </div>

                                <Link to="/profile" className="btn btn-outline-light">
                                    Profile
                                </Link>

                                {user.role?.name === "ADMIN" && (
                                    <Link to="/admin" className="btn btn-outline-light">
                                        Admin Panel
                                    </Link>
                                )}

                                <button className="btn btn-warning" onClick={logout}>
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
