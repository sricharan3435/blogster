import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const response = await fetch(
            "https://api.sricharan3435.workers.dev/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            }
        );

        const data = await response.json();
        
        if(!response.ok) {
            setMessage(data.message);
            return;
        }

        setMessage(data.message);
        localStorage.setItem("token", data.token);

        navigate("/");
    }

    return (
        <div className="auth-page">
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />  

                <button type="submit">Login</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
}

export default Login;