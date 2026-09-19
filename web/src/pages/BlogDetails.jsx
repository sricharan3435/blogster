import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function BlogDetails() {

    const {id} = useParams();

    const [blog, setBlog] = useState(null);

    useEffect(() => {
        async function fetchBlog() {
            const response = await fetch(
                `https://api.sricharan3435.workers.dev/blogs/${id}`
            );

            const data = await response.json();
            if(!response.ok) {
                console.log(data);
                return;
            }
            setBlog(data.blog);
        }
        fetchBlog();
    }, [id]);

    return (
        <div className="main">
            {blog ? (
                <>
                    <h2>{blog.title}</h2>
                    <p className="blog-author">By {blog.author_name}</p>
                    <p className="blog-date">
                        {new Date(blog.created_at).toLocaleDateString()}
                    </p>
                    <p>{blog.content}</p>
                </>
            ) : (
                <p>Loading blog...</p>
            )}
        </div>
    );
}

export default BlogDetails;