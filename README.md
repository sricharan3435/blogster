# Blogster

Blogster is a full-stack social blogging platform where people can publish stories, discover writers, follow profiles, like posts, and join conversations through comments.

**Live application:** [mini-blog-web.sricharan3435.workers.dev](https://mini-blog-web.sricharan3435.workers.dev)

## Features

- Account registration and JWT-based authentication
- Story creation, editing, deletion, search, and pagination
- Public writer profiles with bios and avatars
- Follow and unfollow writers
- Like and unlike stories
- Comment on stories and delete owned comments
- Story, follower, following, like, and comment counts
- Responsive editorial interface
- Persistent light and dark modes
- Loading, empty, validation, and error states

## Technology

### Web

- React 19
- React Router
- Vite
- CSS custom properties and responsive layouts
- Cloudflare Workers Static Assets

### API

- TypeScript
- Hono
- Zod
- JWT authentication
- bcryptjs password hashing
- Cloudflare Workers
- Cloudflare D1

## Repository structure

```text
mini-blog/
├── web/                    # React frontend
│   ├── src/components/     # Shared UI components
│   ├── src/pages/          # Application pages
│   └── src/lib/            # API and display helpers
├── api/                    # Hono API Worker
│   ├── migrations/         # D1 database migrations
│   └── src/                # Routes, schemas, middleware, and types
└── PROJECT_GUIDE.md        # Complete step-by-step documentation
```

For a detailed explanation of every frontend and backend step, see [PROJECT_GUIDE.md](./PROJECT_GUIDE.md).

## Run locally

### 1. Install dependencies

```bash
cd api
npm install

cd ../web
npm install
```

### 2. Prepare the API

From the `api` directory, apply the D1 migrations locally:

```bash
npx wrangler d1 migrations apply mini-blog-db --local
```

Store the JWT signing secret securely for local development or deployment. Do not commit real secrets to Git.

Start the API:

```bash
npm run dev
```

### 3. Start the frontend

In another terminal:

```bash
cd web
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## API overview

### Authentication and profiles

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Create an account |
| `POST` | `/login` | Sign in and receive a JWT |
| `GET` | `/me` | Get the signed-in user's profile |
| `PUT` | `/me` | Update the signed-in user's profile |
| `GET` | `/users/:id` | Get a public writer profile |
| `GET` | `/users/:id/follow-status` | Check follow status |
| `POST` | `/users/:id/follow` | Follow a writer |
| `DELETE` | `/users/:id/follow` | Unfollow a writer |

### Stories and social activity

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/blogs` | Search and paginate stories |
| `GET` | `/blogs/me` | Get the signed-in user's stories |
| `GET` | `/blogs/:id` | Get one story |
| `POST` | `/blogs` | Publish a story |
| `PUT` | `/blogs/:id` | Update an owned story |
| `DELETE` | `/blogs/:id` | Delete an owned story |
| `GET` | `/blogs/:id/social` | Get likes and comments |
| `GET` | `/blogs/:id/like-status` | Check the current user's like state |
| `POST` | `/blogs/:id/like` | Like a story |
| `DELETE` | `/blogs/:id/like` | Unlike a story |
| `POST` | `/blogs/:id/comments` | Add a comment |
| `DELETE` | `/comments/:id` | Delete an owned comment |

Protected endpoints require this header:

```text
Authorization: Bearer <token>
```

## Validate the project

Frontend:

```bash
cd web
npm run lint
npm run build
```

API Worker bundle:

```bash
cd api
npx wrangler deploy --dry-run --minify
```

## Deployment

Deploy the API after applying new remote migrations:

```bash
cd api
npx wrangler d1 migrations apply mini-blog-db --remote
npm run deploy
```

Build and deploy the frontend:

```bash
cd web
npm run build
../api/node_modules/.bin/wrangler deploy
```

### Live services

- Frontend: [mini-blog-web.sricharan3435.workers.dev](https://mini-blog-web.sricharan3435.workers.dev)
- API: [api.sricharan3435.workers.dev](https://api.sricharan3435.workers.dev)

## Documentation

Read [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) for the complete chronological implementation guide, database design, route descriptions, validation process, and recommended development workflow.
