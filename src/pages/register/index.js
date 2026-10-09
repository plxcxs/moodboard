import { useState } from "react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    async function handleSubmit(event) {
        event.preventDefault();
        const { email, password } = Object.fromEntries(
            new FormData(event.target),
        );
        const response = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.message);
            return;
        }
        await signIn("credentials", { email, password, callbackUrl: "/" });
    }
    return (
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            {errorMessage && <p>{errorMessage}</p>}

            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
            <label htmlFor="password">Password</label>
            <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                minLength={8}
                required
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide Password" : "Show Pasword"}
            >
                {showPassword ? <EyeOff /> : <Eye />}
            </button>
            <button type="submit">Register</button>
        </form>
    );
}
