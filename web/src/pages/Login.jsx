import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../lib/api";
import ThemeToggle from "../components/ThemeToggle";

function Login() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault(); setMessage(""); setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) return setMessage(data.message || "Unable to sign in.");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch { setMessage("Unable to reach the server. Please try again."); }
    finally { setSubmitting(false); }
  }
  return <main className="auth-shell">
    <section className="auth-panel">
      <div className="auth-top"><Link className="brand" to="/"><span className="brand-mark">B</span><span>Blogster</span></Link><ThemeToggle /></div>
      <div className="auth-center"><p className="eyebrow">Welcome back</p><h1>Continue your story.</h1><p>Sign in to write, edit, and manage your published stories.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {message && <p className="message">{message}</p>}
          <div className="form-group"><label htmlFor="email">Email address</label><input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="form-group"><label htmlFor="password">Password</label><input id="password" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} minLength="6" required /></div>
          <button className="button button-primary" disabled={submitting}>{submitting ? "Signing in…" : "Sign in"}</button>
          <p className="auth-switch">New to Blogster? <Link to="/register">Create an account</Link></p>
        </form>
      </div>
    </section>
    <aside className="auth-visual"><blockquote className="auth-quote">“There is no greater agony than bearing an untold story inside you.”</blockquote><p className="auth-attribution">— Maya Angelou</p></aside>
  </main>;
}
export default Login;
