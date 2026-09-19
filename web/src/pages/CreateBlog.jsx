import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

function CreateBlog() {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    if(!token) {
        return <Navigate to="/login" />;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const response = await fetch(
            "https://api.sricharan3435.workers.dev/blogs",
            {
                method: "POST",

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
        setTitle("");
        setContent("");

        navigate("/my-blogs");
    }

    return (
        <div className="main">
            <h2>Create Blog</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <button type="submit">Create Blog</button>

            </form>
        </div>
    );
}

export default CreateBlog;