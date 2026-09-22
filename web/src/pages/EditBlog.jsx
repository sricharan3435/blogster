import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import { API_URL } from "../lib/api";

function EditBlog(){
  const {id}=useParams();const navigate=useNavigate();const [title,setTitle]=useState("");const [content,setContent]=useState("");const [error,setError]=useState("");const [loading,setLoading]=useState(true);const [submitting,setSubmitting]=useState(false);const token=localStorage.getItem("token");
  useEffect(()=>{const controller=new AbortController();async function fetchBlog(){try{const response=await fetch(`${API_URL}/blogs/${id}`,{signal:controller.signal});const data=await response.json();if(!response.ok)throw new Error(data.message||"Unable to load this story.");setTitle(data.blog.title);setContent(data.blog.content);}catch(err){if(err.name!=="AbortError")setError(err.message);}finally{if(!controller.signal.aborted)setLoading(false);}}fetchBlog();return()=>controller.abort();},[id]);
  if(!token)return <Navigate to="/login"/>;
  async function handleSubmit(e){e.preventDefault();setError("");setSubmitting(true);try{const response=await fetch(`${API_URL}/blogs/${id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({title,content})});const data=await response.json();if(!response.ok)return setError(data.message||"Unable to save changes.");navigate("/my-blogs");}catch{setError("Unable to reach the server. Please try again.");}finally{setSubmitting(false);}}
  return <PageShell><main className="content-shell form-page"><section className="form-intro"><p className="eyebrow">Editing</p><h1 className="page-title">Shape the story.</h1><p className="page-subtitle">Good writing is rewriting. Make every sentence earn its place.</p></section>
    <form className="form-card" onSubmit={handleSubmit}>{loading?<div className="state-card"><div className="spinner"/>Loading your draft…</div>:<>{error&&<p className="message">{error}</p>}<div className="form-group"><label htmlFor="title">Story title</label><input id="title" value={title} onChange={(e)=>setTitle(e.target.value)} minLength="2" required/></div><div className="form-group"><label htmlFor="content">Your story</label><textarea id="content" value={content} onChange={(e)=>setContent(e.target.value)} minLength="5" required/><p className="form-hint">{content.length} characters</p></div><div className="form-actions"><button type="button" className="button button-secondary" onClick={()=>navigate(-1)}>Cancel</button><button className="button button-primary" disabled={submitting}>{submitting?"Saving…":"Save changes"}</button></div></>}</form>
  </main></PageShell>;
}
export default EditBlog;
