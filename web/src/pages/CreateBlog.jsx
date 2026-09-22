import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import PageShell from "../components/PageShell";
import { API_URL } from "../lib/api";

function CreateBlog() {
  const [title,setTitle]=useState(""); const [content,setContent]=useState(""); const [error,setError]=useState(""); const [submitting,setSubmitting]=useState(false);
  const navigate=useNavigate(); const token=localStorage.getItem("token");
  if(!token)return <Navigate to="/login" />;
  async function handleSubmit(e){e.preventDefault();setError("");setSubmitting(true);try{const response=await fetch(`${API_URL}/blogs`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({title,content})});const data=await response.json();if(!response.ok)return setError(data.message||"Unable to publish your story.");navigate("/my-blogs");}catch{setError("Unable to reach the server. Please try again.");}finally{setSubmitting(false);}}
  return <PageShell><main className="content-shell form-page"><section className="form-intro"><p className="eyebrow">New story</p><h1 className="page-title">Start with a spark.</h1><p className="page-subtitle">Give your idea room to breathe. You can always come back and refine it later.</p></section>
    <form className="form-card" onSubmit={handleSubmit}>{error&&<p className="message">{error}</p>}
      <div className="form-group"><label htmlFor="title">Story title</label><input id="title" type="text" placeholder="A title that draws readers in" value={title} onChange={(e)=>setTitle(e.target.value)} minLength="2" required/><p className="form-hint">Keep it clear, specific, and memorable.</p></div>
      <div className="form-group"><label htmlFor="content">Your story</label><textarea id="content" placeholder="Tell us what’s on your mind…" value={content} onChange={(e)=>setContent(e.target.value)} minLength="5" required/><p className="form-hint">{content.length} characters</p></div>
      <div className="form-actions"><button type="button" className="button button-secondary" onClick={()=>navigate(-1)}>Cancel</button><button className="button button-primary" disabled={submitting}>{submitting?"Publishing…":"Publish story"}</button></div>
    </form></main></PageShell>;
}
export default CreateBlog;
