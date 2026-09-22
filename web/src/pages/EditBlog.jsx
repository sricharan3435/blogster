import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";


function EditBlog() {

    const {id} = useParams();

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const token = localStorage.getItem("token");

    if(!token) {
        return <Navigate to="/login" />;
    }

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

            setTitle(data.blog.title);
            setContent(data.blog.content);
        }
        fetchBlog();
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();

        const response = await fetch(
            `https://api.sricharan3435.workers.dev/blogs/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },

                body: JSON.stringify({
                    title: title,
                    content: content,
                }),
            }
        );

        const data = await response.json();

        if(!response.ok) {
            console.log(data);
            return;
        }
        navigate("/my-blogs");
    }

    return (
        <div className="main">
            <h2>Edit Blog</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <button type="submit">Update Blog</button>        
            </form>
        </div>
    );
}

export default EditBlog;