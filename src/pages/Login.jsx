import { useNavigate, Link } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login({ email, password });
            navigate("/profile");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (setter, value) => {
        setError("");
        setter(value);
    };

    return (
        <div className="d-flex justify-content-center align-items-start vh-100">
            <div className="card shadow-sm p-4 mt-5" style={{ width: "100%", maxWidth: "400px" }}>
                <h2 className="card-title text-center mb-4">Login</h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleLogin}>
                    <input
                        className="form-control mb-3"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => handleChange(setEmail, e.target.value)}
                        required
                    />
                    <input
                        className="form-control mb-3"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => handleChange(setPassword, e.target.value)}
                        required
                    />
                    <button
                        className="btn btn-primary w-100 mb-3"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging In..." : "Login"}
                    </button>
                </form>

                <div className="text-center">
                    <small>
                        Don't have an account? <Link to="/register">Sign up</Link>
                    </small>
                </div>
            </div>
        </div>
    );
}
