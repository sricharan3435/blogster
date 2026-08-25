import { Hono } from "hono";
import type { Bindings, Variables } from "./types";
import blogRoutes from "./routes/blog";
import authRoutes from "./routes/auth";
import { success } from "zod";


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

app.route("/", blogRoutes);

app.route("/", authRoutes);



export default app;
