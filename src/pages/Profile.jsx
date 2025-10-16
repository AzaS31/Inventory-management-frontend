import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <p className="text-center mt-5">Loading...</p>;
    if (!user) return <p className="text-center mt-5">Please login</p>;

    return (
        <div className="container mt-5">
            <p>Email: {user.email}</p>
            <p>Role: {user.role?.name}</p>
        </div>
    );
}
