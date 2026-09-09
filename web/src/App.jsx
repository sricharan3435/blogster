import "./App.css";
import { useEffect, useState } from "react";

function App() {

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBlogs() {
      try {
      const response = await fetch(
        "https://api.sricharan3435.workers.dev/blogs"
      );

      if(!response.ok){
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();
      setBlogs(data.blogs);

      } 
      catch (err){
      setError(err.message);
      } 
      finally {
      setLoading(false);
      }
    }  

    fetchBlogs();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Mini Blog</h1>

        <nav>
          <button>Login</button>
          <button>Register</button>
        </nav>
      </header>

      <main className="main">
        <h2>Latest Blogs</h2>
        <p>Discover stories and ideas from our community.</p>

        <div className="blog-list">
          
          {loading ? (
            <p>Loading blogs...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            
            blogs.map((blog) => (
            <div className="blog-card" key={blog.id}>
              <h3>{blog.title}</h3>
              <p className="blog-author"> By {blog.author_name}</p>
              <p className="blog-date">{new Date(blog.created_at).toLocaleDateString()}</p>
              <p>{blog.content}</p>
            </div>  
          ))
        )}
        </div>
      </main>
    </div>
  );
}

export default App;