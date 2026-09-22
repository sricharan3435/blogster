import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { commentSchema, profileSchema } from "../schemas/social";
import type { Bindings, Variables } from "../types";

const socialRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

socialRoutes.get("/me", authMiddleware, async (c) => {
  const authUser = c.get("user");
  const user = await c.env.mini_blog_db.prepare(`
    SELECT id, name, email, bio, avatar_url, created_at,
      (SELECT COUNT(*) FROM follows WHERE following_id = users.id) AS followers_count,
      (SELECT COUNT(*) FROM follows WHERE follower_id = users.id) AS following_count,
      (SELECT COUNT(*) FROM blogs WHERE user_id = users.id) AS blogs_count
    FROM users WHERE id = ?
  `).bind(authUser.id).first();
  return user ? c.json({ success: true, user }) : c.json({ success: false, message: "User not found" }, 404);
});

socialRoutes.put("/me", authMiddleware, validate(profileSchema), async (c) => {
  const user = c.get("user");
  const body = c.get("validatedBody");
  await c.env.mini_blog_db.prepare("UPDATE users SET name = ?, bio = ?, avatar_url = ? WHERE id = ?")
    .bind(body.name, body.bio, body.avatar_url, user.id).run();
  return c.json({ success: true, message: "Profile updated" });
});

socialRoutes.get("/users/:id", async (c) => {
  const id = parseId(c.req.param("id"));
  if (!id) return c.json({ success: false, message: "Invalid user ID" }, 400);
  const user = await c.env.mini_blog_db.prepare(`
    SELECT id, name, bio, avatar_url, created_at,
      (SELECT COUNT(*) FROM follows WHERE following_id = users.id) AS followers_count,
      (SELECT COUNT(*) FROM follows WHERE follower_id = users.id) AS following_count,
      (SELECT COUNT(*) FROM blogs WHERE user_id = users.id) AS blogs_count
    FROM users WHERE id = ?
  `).bind(id).first();
  if (!user) return c.json({ success: false, message: "User not found" }, 404);
  const blogs = await c.env.mini_blog_db.prepare(`
    SELECT blogs.id, blogs.title, blogs.content, blogs.created_at,
      (SELECT COUNT(*) FROM likes WHERE blog_id = blogs.id) AS likes_count,
      (SELECT COUNT(*) FROM comments WHERE blog_id = blogs.id) AS comments_count
    FROM blogs WHERE user_id = ? ORDER BY blogs.id DESC
  `).bind(id).all();
  return c.json({ success: true, user, blogs: blogs.results });
});

socialRoutes.get("/users/:id/follow-status", authMiddleware, async (c) => {
  const id = parseId(c.req.param("id"));
  if (!id) return c.json({ success: false, message: "Invalid user ID" }, 400);
  const user = c.get("user");
  const follow = await c.env.mini_blog_db.prepare("SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?")
    .bind(user.id, id).first();
  return c.json({ success: true, following: Boolean(follow) });
});

socialRoutes.post("/users/:id/follow", authMiddleware, async (c) => {
  const id = parseId(c.req.param("id")); const user = c.get("user");
  if (!id) return c.json({ success: false, message: "Invalid user ID" }, 400);
  if (id === user.id) return c.json({ success: false, message: "You cannot follow yourself" }, 400);
  const target = await c.env.mini_blog_db.prepare("SELECT id FROM users WHERE id = ?").bind(id).first();
  if (!target) return c.json({ success: false, message: "User not found" }, 404);
  await c.env.mini_blog_db.prepare("INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)").bind(user.id, id).run();
  return c.json({ success: true, following: true });
});

socialRoutes.delete("/users/:id/follow", authMiddleware, async (c) => {
  const id = parseId(c.req.param("id"));
  if (!id) return c.json({ success: false, message: "Invalid user ID" }, 400);
  await c.env.mini_blog_db.prepare("DELETE FROM follows WHERE follower_id = ? AND following_id = ?").bind(c.get("user").id, id).run();
  return c.json({ success: true, following: false });
});

socialRoutes.get("/blogs/:id/social", async (c) => {
  const id = parseId(c.req.param("id"));
  if (!id) return c.json({ success: false, message: "Invalid blog ID" }, 400);
  const counts = await c.env.mini_blog_db.prepare(`SELECT
    (SELECT COUNT(*) FROM likes WHERE blog_id = ?) AS likes_count,
    (SELECT COUNT(*) FROM comments WHERE blog_id = ?) AS comments_count
  `).bind(id, id).first();
  const comments = await c.env.mini_blog_db.prepare(`
    SELECT comments.id, comments.content, comments.created_at, comments.user_id,
      users.name AS author_name, users.avatar_url AS author_avatar
    FROM comments JOIN users ON comments.user_id = users.id
    WHERE comments.blog_id = ? ORDER BY comments.id DESC
  `).bind(id).all();
  return c.json({ success: true, ...counts, comments: comments.results });
});

socialRoutes.get("/blogs/:id/like-status", authMiddleware, async (c) => {
  const id = parseId(c.req.param("id"));
  if (!id) return c.json({ success: false, message: "Invalid blog ID" }, 400);
  const like = await c.env.mini_blog_db.prepare("SELECT 1 FROM likes WHERE user_id = ? AND blog_id = ?").bind(c.get("user").id, id).first();
  return c.json({ success: true, liked: Boolean(like) });
});

socialRoutes.post("/blogs/:id/like", authMiddleware, async (c) => {
  const id = parseId(c.req.param("id"));
  if (!id) return c.json({ success: false, message: "Invalid blog ID" }, 400);
  await c.env.mini_blog_db.prepare("INSERT OR IGNORE INTO likes (user_id, blog_id) VALUES (?, ?)").bind(c.get("user").id, id).run();
  return c.json({ success: true, liked: true });
});

socialRoutes.delete("/blogs/:id/like", authMiddleware, async (c) => {
  const id = parseId(c.req.param("id"));
  if (!id) return c.json({ success: false, message: "Invalid blog ID" }, 400);
  await c.env.mini_blog_db.prepare("DELETE FROM likes WHERE user_id = ? AND blog_id = ?").bind(c.get("user").id, id).run();
  return c.json({ success: true, liked: false });
});

socialRoutes.post("/blogs/:id/comments", authMiddleware, validate(commentSchema), async (c) => {
  const id = parseId(c.req.param("id"));
  if (!id) return c.json({ success: false, message: "Invalid blog ID" }, 400);
  const blog = await c.env.mini_blog_db.prepare("SELECT id FROM blogs WHERE id = ?").bind(id).first();
  if (!blog) return c.json({ success: false, message: "Blog not found" }, 404);
  const body = c.get("validatedBody");
  await c.env.mini_blog_db.prepare("INSERT INTO comments (user_id, blog_id, content) VALUES (?, ?, ?)").bind(c.get("user").id, id, body.content).run();
  return c.json({ success: true, message: "Comment added" }, 201);
});

socialRoutes.delete("/comments/:id", authMiddleware, async (c) => {
  const id = parseId(c.req.param("id"));
  if (!id) return c.json({ success: false, message: "Invalid comment ID" }, 400);
  const comment = await c.env.mini_blog_db.prepare("SELECT user_id FROM comments WHERE id = ?").bind(id).first<{ user_id: number }>();
  if (!comment) return c.json({ success: false, message: "Comment not found" }, 404);
  if (comment.user_id !== c.get("user").id) return c.json({ success: false, message: "Permission denied" }, 403);
  await c.env.mini_blog_db.prepare("DELETE FROM comments WHERE id = ?").bind(id).run();
  return c.json({ success: true, message: "Comment deleted" });
});

export default socialRoutes;
