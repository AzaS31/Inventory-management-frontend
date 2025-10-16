import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await register({ username, email, password });
            navigate("/profile");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-start vh-100">
            <div className="card shadow-sm p-4 mt-5" style={{ width: "100%", maxWidth: "400px" }}>
                <h2 className="card-title text-center mb-4">Register</h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleRegister}>
                    <input
                        className="form-control mb-3"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        className="form-control mb-3"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="form-control mb-3"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        className="btn btn-success w-100 mb-3"
                        disabled={isLoading}
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                </form>

                <div className="text-center">
                    <small>
                        Already have an account? <Link to="/login">Login</Link>
                    </small>
                </div>
            </div>
        </div>
    );
}
