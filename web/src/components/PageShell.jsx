import SiteHeader from "./SiteHeader";

function PageShell({ children, className = "" }) {
  return <div className={`app-shell ${className}`}>
    <SiteHeader />
    {children}
    <footer className="site-footer">
      <span className="brand footer-brand"><span className="brand-mark">B</span> Blogster</span>
      <p>A quiet place for loud ideas.</p>
      <p>© {new Date().getFullYear()} Blogster</p>
    </footer>
  </div>;
}

export default PageShell;
