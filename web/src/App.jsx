import "./App.css";
import { useEffect, useState } from "react";

function App() {

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchBlogs() {
      const response = await fetch(
        "https://api.sricharan3435.workers.dev/blogs"
      );

      const data = await response.json();

      setBlogs(data.blogs);
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
          {blogs.map((blog) => (
            <div key={blog.id}>
              <h3>{blog.title}</h3>
              <p>{blog.content}</p>
            </div>  
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;