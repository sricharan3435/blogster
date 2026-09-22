import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBlogs from "./pages/MyBlogs";
import CreateBlog from "./pages/CreateBlog";
import BlogDetails from "./pages/BlogDetails";
import EditBlog from "./pages/EditBlog";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import "./App.css";
import "./social.css";
import "./theme.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/my-blogs" element={<MyBlogs />} />
      <Route path="/create" element={<CreateBlog />} />
      <Route path="/blogs/:id" element={<BlogDetails />} />
      <Route path="/blogs/:id/edit" element={<EditBlog />} />
      <Route path="/users/:id" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
    </Routes>
  );  
}

export default App;
