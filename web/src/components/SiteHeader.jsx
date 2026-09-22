import { Link, NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function SiteHeader() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  }

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="brand" to="/" aria-label="Blogster home">
          <span className="brand-mark">B</span><span>Blogster</span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <ThemeToggle />
          <NavLink to="/" end>Explore</NavLink>
          {token ? <>
            <NavLink to="/my-blogs">My stories</NavLink>
            <NavLink to="/profile/edit">Profile</NavLink>
            <Link className="button button-small button-primary" to="/create"><span>＋</span> Write</Link>
            <button className="nav-text-button" onClick={handleLogout}>Log out</button>
          </> : <>
            <NavLink to="/login">Sign in</NavLink>
            <Link className="button button-small button-primary" to="/register">Join Blogster</Link>
          </>}
        </nav>
      </div>
    </header>
  );
}

export default SiteHeader;
