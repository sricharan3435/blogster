import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import { API_URL, formatDate, getExcerpt } from "../lib/api";

function MyBlogs(){
  const [blogs,setBlogs]=useState([]);const [loading,setLoading]=useState(true);const [error,setError]=useState("");const token=localStorage.getItem("token");
  useEffect(()=>{if(!token)return;const controller=new AbortController();async function fetchMine(){try{const response=await fetch(`${API_URL}/blogs/me`,{headers:{Authorization:`Bearer ${token}`},signal:controller.signal});const data=await response.json();if(!response.ok)throw new Error(data.message||"Unable to load your stories.");setBlogs(data.blogs);}catch(err){if(err.name!=="AbortError")setError(err.message);}finally{if(!controller.signal.aborted)setLoading(false);}}fetchMine();return()=>controller.abort();},[token]);
  if(!token)return <Navigate to="/login"/>;
  async function handleDelete(id){if(!window.confirm("Delete this story? This cannot be undone."))return;try{const response=await fetch(`${API_URL}/blogs/${id}`,{method:"DELETE",headers:{Authorization:`Bearer ${token}`}});const data=await response.json();if(!response.ok)throw new Error(data.message||"Unable to delete this story.");setBlogs((current)=>current.filter((blog)=>blog.id!==id));}catch(err){setError(err.message);}}
  return <PageShell><main className="content-shell"><header className="page-head"><div><p className="eyebrow">Your writing desk</p><h1 className="page-title">My stories</h1><p className="page-subtitle">Everything you’ve written, gathered in one place.</p></div><Link className="button button-primary" to="/create">＋ New story</Link></header>
    {error&&<p className="message">{error}</p>}<div className="manage-list">{loading?<div className="state-card"><div className="spinner"/>Loading your stories…</div>:blogs.length===0?<div className="state-card"><strong>Your first story starts here</strong>You haven’t published anything yet.<br/><br/><Link className="button button-small button-primary" to="/create">Write a story</Link></div>:blogs.map((blog)=><article className="manage-card" key={blog.id}><div><h3>{blog.title}</h3><p>{getExcerpt(blog.content,240)}</p><p className="manage-meta">Published {formatDate(blog.created_at)}</p></div><div className="card-actions"><Link className="button button-small button-secondary" to={`/blogs/${blog.id}/edit`}>Edit</Link><button className="button button-small button-danger" onClick={()=>handleDelete(blog.id)}>Delete</button></div></article>)}</div>
  </main></PageShell>;
}
export default MyBlogs;
