# Blogster — Complete Project Guide

Blogster is a full-stack social blogging application. The repository is split into two independent applications:

- `web/` — React 19 frontend built with Vite and deployed with Cloudflare Workers Static Assets.
- `api/` — Hono REST API running on Cloudflare Workers with Cloudflare D1 storage.

## Project structure

```text
mini-blog/
├── web/
│   ├── public/                 # Static icons and favicon
│   ├── src/
│   │   ├── components/         # Shared header, page shell, and theme toggle
│   │   ├── lib/                # API URL and display helpers
│   │   ├── pages/              # Route-level React pages
│   │   ├── App.jsx             # Application routes
│   │   ├── App.css             # Main design system
│   │   ├── social.css          # Profile, likes, and comments styles
│   │   ├── theme.css           # Light and dark themes
│   │   └── main.jsx            # React entry point and initial theme
│   └── wrangler.jsonc          # Frontend deployment configuration
├── api/
│   ├── migrations/             # Ordered D1 database migrations
│   ├── src/
│   │   ├── middleware/         # Authentication and request validation
│   │   ├── routes/             # Auth, blog, and social endpoints
│   │   ├── schemas/            # Zod request schemas
│   │   ├── types/              # Shared TypeScript types
│   │   └── index.ts            # Hono app, CORS, and route registration
│   └── wrangler.jsonc          # API Worker and D1 configuration
└── PROJECT_GUIDE.md
```

---

# Web application

## Step 1 — Create the React application

The frontend was created with React and Vite. React Router provides client-side routing.

```bash
cd web
npm install
npm run dev
```

The development URL is normally `http://localhost:5173`. If that port is occupied, Vite selects another available port.

## Step 2 — Configure the application routes

Routes are registered in `web/src/App.jsx`:

| Route | Page | Purpose |
|---|---|---|
| `/` | `Home` | Browse and search stories |
| `/login` | `Login` | User authentication |
| `/register` | `Register` | Account creation |
| `/my-blogs` | `MyBlogs` | Manage the signed-in user's stories |
| `/create` | `CreateBlog` | Publish a story |
| `/blogs/:id` | `BlogDetails` | Read, like, and comment on a story |
| `/blogs/:id/edit` | `EditBlog` | Edit an owned story |
| `/users/:id` | `Profile` | View a public writer profile |
| `/profile/edit` | `EditProfile` | Edit the signed-in user's profile |

## Step 3 — Connect the frontend to the API

`web/src/lib/api.js` contains the API base URL and shared formatting helpers.

The frontend uses the browser `fetch` API. Protected requests include the JWT:

```js
headers: {
  Authorization: `Bearer ${token}`,
}
```

The token and basic signed-in user information are stored in `localStorage`. Logging out removes both values.

## Step 4 — Build the shared layout

The reusable UI is separated into components:

- `SiteHeader.jsx` provides navigation, authentication actions, and the theme control.
- `PageShell.jsx` provides the shared header and footer.
- `ThemeToggle.jsx` switches and remembers the color theme.

The navigation changes depending on authentication state. Signed-in users can access their stories, profile, writing page, and logout action.

## Step 5 — Build the home and story experience

The home page:

1. Fetches paginated stories from `GET /blogs`.
2. Sends the search text through the `search` query parameter.
3. Displays author links, publication dates, excerpts, likes, and comment counts.
4. Provides loading, empty, and failure states.
5. Provides previous and next pagination controls.

The story details page:

1. Loads the story from `GET /blogs/:id`.
2. Loads likes and comments from `GET /blogs/:id/social`.
3. Checks the signed-in user's like status.
4. Allows authenticated users to like/unlike and comment.
5. Allows a comment author to delete their own comment.
6. Links the story author and commenters to their public profiles.

## Step 6 — Add authentication pages

Registration sends a name, email, and password to `POST /register`.

Login sends credentials to `POST /login`. A successful response stores:

- `token` — used for protected API requests.
- `user` — used for client-side ownership UI.

Protected pages redirect visitors to `/login` if no token is available.

## Step 7 — Add story management

Authenticated users can:

- Create stories with `POST /blogs`.
- List their stories with `GET /blogs/me`.
- Edit owned stories with `PUT /blogs/:id`.
- Delete owned stories with `DELETE /blogs/:id`.

The frontend includes submission states, validation attributes, error feedback, and deletion confirmation.

## Step 8 — Add profiles and follows

The public profile page displays:

- Name, bio, and optional avatar.
- Number of stories, followers, and followed users.
- All stories written by that user.
- Follow/unfollow action for authenticated visitors.

The profile editor loads the current user from `GET /me` and saves changes with `PUT /me`.

## Step 9 — Add light and dark modes

Theme behavior is implemented in `ThemeToggle.jsx`, `main.jsx`, and `theme.css`.

1. Use a previously saved `localStorage.theme` value when available.
2. Otherwise use the device's `prefers-color-scheme` setting.
3. Set `data-theme` on the root HTML element.
4. Change the design through CSS custom properties.
5. Save manual theme changes for later visits.

Both modes cover navigation, cards, forms, profiles, comments, articles, buttons, and authentication pages.

## Step 10 — Validate and build the frontend

```bash
cd web
npm run lint
npm run build
```

The production output is generated in `web/dist/`.

## Step 11 — Deploy the frontend

Build before deploying:

```bash
cd web
npm run build
../api/node_modules/.bin/wrangler deploy
```

The deployment configuration serves `dist/` and uses SPA fallback so React Router URLs work after a page refresh.

Current deployment:

```text
https://mini-blog-web.sricharan3435.workers.dev
```

---

# API application

## Step 1 — Create the Hono Worker

The backend uses Hono on Cloudflare Workers.

```bash
cd api
npm install
npm run dev
```

`api/src/index.ts` creates the app, handles unexpected errors, configures CORS, and registers all route modules.

## Step 2 — Configure Cloudflare D1

The `mini_blog_db` binding is configured in `api/wrangler.jsonc`. Application code accesses it through:

```ts
c.env.mini_blog_db
```

Database changes are stored as ordered migrations:

| Migration | Change |
|---|---|
| `0001_create_blogs.sql` | Creates the original blogs table |
| `0002_create_users_table.sql` | Creates user accounts |
| `0003_add_user_id_to_blogs.sql` | Connects stories to users |
| `0004_add_social_features.sql` | Adds profiles, follows, likes, comments, constraints, and indexes |

Apply migrations locally first:

```bash
cd api
npx wrangler d1 migrations apply mini-blog-db --local
```

After validation, apply them remotely:

```bash
npx wrangler d1 migrations apply mini-blog-db --remote
```

## Step 3 — Add request validation

Zod schemas validate incoming JSON:

- `schemas/auth.ts` validates registration and login.
- `schemas/blog.ts` validates story titles and content.
- `schemas/social.ts` validates profiles and comments.

The shared `validate` middleware returns status `400` with validation issues when input is invalid.

## Step 4 — Add JWT authentication

Login creates a signed JWT containing the user ID. Protected requests send it through the authorization header:

```text
Authorization: Bearer <token>
```

`authMiddleware` verifies the token and makes the authenticated user available through `c.get("user")`.

Production secrets should be stored with Wrangler rather than committed to Git:

```bash
cd api
npx wrangler secret put JWT_SECRET
```

## Step 5 — Add authentication endpoints

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| `POST` | `/register` | No | Create an account and hash its password |
| `POST` | `/login` | No | Verify credentials and return a JWT and user summary |
| `GET` | `/me` | Yes | Return the current profile and counts |
| `PUT` | `/me` | Yes | Update name, bio, and avatar URL |

Passwords are hashed with `bcryptjs` and are never included in API responses.

## Step 6 — Add blog endpoints

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| `GET` | `/blogs` | No | Search and paginate stories with social counts |
| `GET` | `/blogs/me` | Yes | List the current user's stories |
| `GET` | `/blogs/:id` | No | Read one story and its author data |
| `POST` | `/blogs` | Yes | Create a story |
| `PUT` | `/blogs/:id` | Yes | Update an owned story |
| `DELETE` | `/blogs/:id` | Yes | Delete an owned story |

Update and delete operations verify that the authenticated user owns the story.

## Step 7 — Add public profiles and follows

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| `GET` | `/users/:id` | No | Return a public profile, counts, and stories |
| `GET` | `/users/:id/follow-status` | Yes | Check whether the current user follows a profile |
| `POST` | `/users/:id/follow` | Yes | Follow a user |
| `DELETE` | `/users/:id/follow` | Yes | Unfollow a user |

The database prevents users from following themselves and prevents duplicate follow relationships.

## Step 8 — Add likes and comments

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| `GET` | `/blogs/:id/social` | No | Return like count and comments |
| `GET` | `/blogs/:id/like-status` | Yes | Return the current user's like state |
| `POST` | `/blogs/:id/like` | Yes | Like a story |
| `DELETE` | `/blogs/:id/like` | Yes | Unlike a story |
| `POST` | `/blogs/:id/comments` | Yes | Add a comment |
| `DELETE` | `/comments/:id` | Yes | Delete an owned comment |

Composite primary keys prevent duplicate likes. Foreign keys cascade social data when its parent user or story is removed.

## Step 9 — Configure CORS

The API allows:

- The deployed Blogster frontend.
- `localhost` on any HTTP port for development.
- `127.0.0.1` on any HTTP port for development.

Unknown origins are not granted CORS access.

## Step 10 — Validate and deploy the API

Create a deployment bundle without publishing it:

```bash
cd api
npx wrangler deploy --dry-run --minify
```

Deploy after the migrations have been applied:

```bash
npm run deploy
```

Current deployment:

```text
https://api.sricharan3435.workers.dev
```

---

# Recommended development workflow

Follow this order when adding another feature:

1. Design the database change.
2. Add a new numbered migration; never rewrite an already-applied migration.
3. Add or update Zod request schemas.
4. Implement the API endpoint and authorization rules.
5. Apply migrations to a local D1 database.
6. Run an API dry-run build.
7. Add the frontend API call and UI states.
8. Run frontend lint and production build.
9. Apply the migration remotely.
10. Deploy the API before deploying a frontend that depends on it.
11. Perform read-only smoke tests against the deployed application.
12. Commit the source and migration together.

# Git workflow

```bash
git status
git diff --check
git add .
git commit -m "Add Blogster social features and theme support"
git push origin main
```

Before pushing, confirm that no `.dev.vars`, credentials, tokens, generated logs, or local D1 state files are staged.
