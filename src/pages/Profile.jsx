import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        api.get("/auth/profile")
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    if (!user) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div className="container mt-5">
            <h2>Welcome, {user.username}</h2>
            <p>Email: {user.email}</p>
            <p>Role: {user.role?.name}</p>
            
        </div>
    );
}
