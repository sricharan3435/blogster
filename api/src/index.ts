import { Hono } from "hono";
import type { Bindings, Variables } from "./types";
import blogRoutes from "./routes/blog";
import authRoutes from "./routes/auth";
import { cors } from "hono/cors";
import socialRoutes from "./routes/social";


const app = new Hono<{ 
  Bindings: Bindings;
  Variables : Variables; 
}>();

app.onError((err, c) => {
  console.error(err);

  return c.json(
    {
      success: false,
      message: "Internal server error",
    },
    500
  );
});

// app.get("/test-error", () => {
//   throw new Error("Something went wrong!");
// });

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (origin === "https://mini-blog-web.sricharan3435.workers.dev") {
        return origin;
      }

      try {
        const url = new URL(origin);
        const isLocalDevelopment =
          url.protocol === "http:" &&
          (url.hostname === "localhost" || url.hostname === "127.0.0.1");

        return isLocalDevelopment ? origin : undefined;
      } catch {
        return undefined;
      }
    },
  })
);

app.route("/", blogRoutes);

app.route("/", authRoutes);
app.route("/", socialRoutes);



export default app;
