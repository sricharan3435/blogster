ALTER TABLE users ADD COLUMN bio TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN avatar_url TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN created_at TEXT NOT NULL DEFAULT '';
UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE created_at = '';

CREATE TABLE follows (
  follower_id INTEGER NOT NULL,
  following_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id),
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE likes (
  user_id INTEGER NOT NULL,
  blog_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, blog_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE
);

CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  blog_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE
);

CREATE INDEX idx_follows_following ON follows(following_id);
CREATE INDEX idx_likes_blog ON likes(blog_id);
CREATE INDEX idx_comments_blog ON comments(blog_id, created_at DESC);
