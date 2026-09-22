import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import heroImage from "../assets/hero.png";
import { API_URL, formatDate, getExcerpt } from "../lib/api";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const controller = new AbortController();
    async function fetchBlogs() {
      try {
        setLoading(true); setError("");
        const response = await fetch(`${API_URL}/blogs?page=${page}&limit=5&search=${encodeURIComponent(search)}`, { signal: controller.signal });
        if (!response.ok) throw new Error("We couldn't load the stories. Please try again.");
        const data = await response.json();
        setBlogs(data.blogs); setPagination(data.pagination);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }
    fetchBlogs();
    return () => controller.abort();
  }, [page, search]);

  return <PageShell>
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">Stories worth your time</p>
          <h1>Ideas find their <em>voice</em> here.</h1>
          <p>A thoughtful corner of the internet for curious minds, honest perspectives, and stories that stay with you.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#latest">Start reading ↓</a>
            {!token && <Link className="button button-secondary" to="/register">Share your story</Link>}
          </div>
        </div>
        <div className="hero-art"><img src={heroImage} alt="Abstract stack of story pages" /></div>
      </div>
    </section>
    <main className="content-shell" id="latest">
      <div className="section-heading">
        <div><h2>Fresh from the community</h2><p>New perspectives, published by people like you.</p></div>
        <label className="search-box"><span>⌕</span><input type="search" aria-label="Search stories" placeholder="Search stories…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></label>
      </div>
      {!loading && !error && <p className="results-label">{pagination?.total || 0} {search ? "matching " : "published "}stories</p>}
      <div className="blog-grid">
        {loading ? <div className="state-card"><div className="spinner" />Gathering the latest stories…</div>
          : error ? <div className="state-card"><strong>Something went wrong</strong>{error}</div>
          : blogs.length === 0 ? <div className="state-card"><strong>No stories found</strong>Try another search or be the first to write one.</div>
          : blogs.map((blog) => <article className="blog-card" key={blog.id}>
            <div className="card-meta"><span className="author-avatar">{blog.author_name?.charAt(0).toUpperCase()}</span><Link className="author-link" to={`/users/${blog.user_id}`}>{blog.author_name}</Link><span className="meta-dot">•</span><time>{formatDate(blog.created_at)}</time></div>
            <h3><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></h3>
            <p>{getExcerpt(blog.content, 210)}</p><span className="read-link">Read story →</span><span className="card-stats">♡ {blog.likes_count || 0} · ◯ {blog.comments_count || 0}</span>
          </article>)}
      </div>
      {pagination?.totalPages > 1 && <div className="pagination">
        <button className="button button-small button-secondary" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>← Previous</button>
        <span>{page} of {pagination.totalPages}</span>
        <button className="button button-small button-secondary" onClick={() => setPage((p) => p + 1)} disabled={page === pagination.totalPages}>Next →</button>
      </div>}
    </main>
  </PageShell>;
}
export default Home;
