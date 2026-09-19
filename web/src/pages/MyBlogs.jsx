import { useEffect, useState } from "react";

function MyBlogs() {

    const [blogs, setBlogs] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function fetchMyBlogs() {
            const reponse = await fetch(
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
                return;
            }
            setBlogs(data.blogs);
        }
        fetchMyBlogs();
    }, [token]);

    return (
        <div className="main">
            <h2>My Blogs</h2>
            {blogs.length === 0 ? (
                <p>You havent created any blogs yet.</p>
            ) : (
                blogs.map((blog) => (
                    <div className="blog-card" key={blog.id}>
                        <h3>{blog.title}</h3>
                        <p>{blog.content}</p>
                        <p className="blog-date">
                            {new Date(blog.created_at).toLocaleDateString()}
                        </p>
                    </div>      
                ))
            )}
        </div>
    );
}

export default MyBlogs;