import "./App.css";
import { useEffect, useState } from "react";

function App() {

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {

      setLoading(true);
      setError("");

      const response = await fetch(
        `https://api.sricharan3435.workers.dev/blogs?page=${page}&limit=5`
      );

      if(!response.ok){
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();
      setBlogs(data.blogs);
      setPagination(data.pagination);

      } 
      catch (err){
      setError(err.message);
      } 
      finally {
      setLoading(false);
      }
    }  

    fetchBlogs();
  }, [page]);

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

        <div className="pagination-controls">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          
          <span>
            Page {page} of {pagination?.totalPages || 1}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination?.totalPages}
          >
              Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;