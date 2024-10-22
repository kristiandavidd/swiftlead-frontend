import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("https://swiftlead-backend-production.up.railway.app/api/users")
            .then((res) => {
                setUsers(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("there wasa an arror", err);
            });
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.username} - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}