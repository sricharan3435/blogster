import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../lib/api";
import ThemeToggle from "../components/ThemeToggle";

function Register() {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [message,setMessage]=useState(""); const [submitting,setSubmitting]=useState(false); const navigate=useNavigate();
  async function handleSubmit(e){e.preventDefault();setMessage("");setSubmitting(true);try{const response=await fetch(`${API_URL}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,password})});const data=await response.json();if(!response.ok)return setMessage(data.message||"Unable to create your account.");navigate("/login");}catch{setMessage("Unable to reach the server. Please try again.");}finally{setSubmitting(false);}}
  return <main className="auth-shell"><section className="auth-panel">
    <div className="auth-top"><Link className="brand" to="/"><span className="brand-mark">B</span><span>Blogster</span></Link><ThemeToggle /></div>
    <div className="auth-center"><p className="eyebrow">Join the community</p><h1>Make your mark.</h1><p>Create a free account and give your ideas a place to grow.</p>
      <form className="auth-form" onSubmit={handleSubmit}>{message&&<p className="message">{message}</p>}
        <div className="form-group"><label htmlFor="name">Your name</label><input id="name" type="text" placeholder="How readers will know you" value={name} onChange={(e)=>setName(e.target.value)} required /></div>
        <div className="form-group"><label htmlFor="email">Email address</label><input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} required /></div>
        <div className="form-group"><label htmlFor="password">Password</label><input id="password" type="password" placeholder="At least 6 characters" value={password} onChange={(e)=>setPassword(e.target.value)} minLength="6" required /></div>
        <button className="button button-primary" disabled={submitting}>{submitting?"Creating account…":"Create account"}</button><p className="auth-switch">Already a member? <Link to="/login">Sign in</Link></p>
      </form>
    </div></section><aside className="auth-visual"><blockquote className="auth-quote">Your perspective is one of one. Put it into words.</blockquote><p className="auth-attribution">Start small. Write honestly. Publish when it feels right.</p></aside>
  </main>;
}
export default Register;
