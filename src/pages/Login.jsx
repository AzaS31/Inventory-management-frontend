import { useNavigate, Link } from "react-router-dom";
import { useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import Notification from "../components/Notification";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "info" });

    const showNotification = useCallback((message, type = "info") => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: "", type: "info" }), 5000);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login({ email, password });
            navigate("/profile");
        } catch (err) {
            showNotification(err.response?.data?.message || "Login failed", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const API_URL = import.meta.env.VITE_API_URL;

    return (
        <div className="d-flex justify-content-center align-items-start">
            <div style={{ position: "fixed", top: "110px", left: "50%", transform: "translateX(-50%)", zIndex: 9999 }}>
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ message: "", type: "info" })}
                />
            </div>

            <div className="card shadow-sm p-4 mt-5" style={{ width: "100%", maxWidth: "400px" }}>
                <h2 className="card-title text-center mb-4">Login</h2>

                <form onSubmit={handleLogin}>
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
                    <button className="btn btn-primary w-100 mb-3" disabled={isLoading}>
                        {isLoading ? "Logging In..." : "Login"}
                    </button>
                </form>

                <div className="text-center mb-3">or</div>

                {/* OAuth Buttons */}
                <div className="d-flex flex-column gap-2">
                    <a href={`${API_URL}/auth/google`} className="btn btn-light border w-100 d-flex align-items-center justify-content-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.67 2.75 30.19 0 24 0 14.7 0 6.65 5.36 2.69 13.09l7.96 6.19C12.26 12.05 17.65 9.5 24 9.5z" />
                            <path fill="#34A853" d="M46.1 24.54c0-1.57-.14-3.08-.39-4.54H24v9.02h12.39c-.55 2.87-2.18 5.3-4.61 6.94l7.14 5.55C43.78 37.53 46.1 31.54 46.1 24.54z" />
                            <path fill="#4A90E2" d="M24 48c6.48 0 11.91-2.15 15.88-5.88l-7.14-5.55C30.52 38.66 27.41 39.5 24 39.5c-6.35 0-11.74-3.55-14.35-8.75l-7.96 6.19C6.65 42.64 14.7 48 24 48z" />
                            <path fill="#FBBC05" d="M9.65 30.75C8.77 28.2 8.27 25.45 8.27 22.5s.5-5.7 1.38-8.25L1.69 8.06C.61 10.62 0 13.44 0 16.5c0 3.06.61 5.88 1.69 8.44l7.96-6.19z" />
                        </svg>

                        Continue with Google
                    </a>
                    <a href={`${API_URL}/auth/facebook`} className="btn btn-light border w-100 d-flex align-items-center justify-content-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                            <path fill="#3B5998" d="M24 4C12.95 4 4 12.95 4 24c0 9.85 7.16 18.01 16.5 19.71v-13.9h-4.97v-5.81h4.97v-4.44c0-4.92 2.9-7.65 7.36-7.65 2.14 0 4.38.38 4.38.38v4.82h-2.47c-2.44 0-3.19 1.52-3.19 3.08v3.81h5.43l-.87 5.81h-4.56v13.9C36.84 42.01 44 33.85 44 24 44 12.95 35.05 4 24 4z" />
                        </svg>

                        Continue with Facebook
                    </a>
                </div>

                <div className="text-center mt-3">
                    <small>
                        Don't have an account? <Link to="/register">Sign up</Link>
                    </small>
                </div>
            </div>
        </div>
    );
}
