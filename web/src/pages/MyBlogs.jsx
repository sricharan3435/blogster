import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyBlogs() {

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function fetchMyBlogs() {
            const response = await fetch(
                "https://api.sricharan3435.workers.dev/blogs/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            if (!response.ok) {
                console.log(data.message);
                setLoading(false);
                return;
            }
            setBlogs(data.blogs);
            setLoading(false);
        }
        fetchMyBlogs();
    }, [token]);

    async function handleDelete(id) {

        const confirmed = window.confirm(
            "Are you sure want to delete this blog?"
        );

        if(!confirmed){
            return;
        }

        const response = await fetch(
            `https://api.sricharan3435.workers.dev/blogs/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await response.json();

        if(!response.ok) {
            console.log(data);
            return;
        }
        setBlogs(blogs.filter((blog) => blog.id !== id));
    }

    return (
        <div className="main">
            <h2>My Blogs</h2>
            {loading ? (
                <p>Loading your blogs..</p>
            
            ) : blogs.length === 0 ? (
                <p>You haven't created any blogs yet.</p>
            ) : (
                blogs.map((blog) => (
                    <div className="blog-card" key={blog.id}>
                        <h3>{blog.title}</h3>

                        <p>{blog.content}</p>

                        <p className="blog-date">
                            {new Date(blog.created_at).toLocaleDateString()}
                        </p> 

                        <Link to={`/blogs/${blog.id}/edit`}>
                            Edit
                        </Link>

                        <button onClick={() => handleDelete(blog.id)}>
                            Delete
                        </button>    
                    </div>      
                ))
            )}
        </div>
    );
}

export default MyBlogs;