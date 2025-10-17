import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
    const { user, logout, initialLoading } = useContext(AuthContext);

    if (initialLoading) return null;

    return (
        <header>
            {/* Верхняя темная панель */}
            <div className="px-3 py-2 text-bg-dark border-bottom">
                <div className="container">
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        <Link
                            to="/"
                            className="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none"
                        >
                            <svg
                                className="bi me-2"
                                width="40"
                                height="32"
                                role="img"
                                aria-label="Bootstrap"
                            >
                                <use xlinkHref="#bootstrap"></use>
                            </svg>
                        </Link>

                        <ul className="nav col-12 col-lg-auto my-2 justify-content-between my-md-0 text-small">
                            <div className="d-flex">
                                <li>
                                    <Link to="/" className="nav-link text-secondary">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/dashboard" className="nav-link text-white">
                                        Dashboard
                                    </Link>
                                </li>
                            </div>
                            <div className="d-flex">
                                <li>
                                    <Link to="/profile" className="nav-link text-white">
                                        Profile
                                    </Link>
                                </li>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Панель поиска и кнопки */}
            <div className="px-3 py-2 border-bottom mb-3">
                <div className="container d-flex flex-wrap justify-content-center">
                    <form className="col-12 col-lg-auto mb-2 mb-lg-0 me-lg-auto" role="search">
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Search..."
                            aria-label="Search"
                        />
                    </form>

                    <div className="text-end">
                        {user ? (
                            <>
                                <span className="text-black me-3">Welcome, {user.username}</span>
                                <button className="btn btn-danger" onClick={logout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-light text-dark me-2">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary">
                                    Sign-up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
