import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function Login() {
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string } | null)?.from || "/books";

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token.trim()) return;
    localStorage.setItem("authToken", token.trim());
    navigate(from, { replace: true });
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="logo">📚</div>
        <h1>Welcome back</h1>
        <p>Enter your API auth token to continue.</p>

        <label htmlFor="token">Auth Token</label>
        <input
          id="token"
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your token"
        />

        <button className="primary-btn" type="submit" disabled={!token.trim()}>
          Login
        </button>

        <small>
          Demo gate: any non-empty token is accepted. Connect this to your
          real login API when available.
        </small>
      </form>
    </div>
  );
}