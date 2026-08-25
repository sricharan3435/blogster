import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import type { Bindings, Variables, Blog } from "../types";
import { blogSchema } from "../schemas/blog";
import { validate } from "../middleware/validate";

const blogRoutes = new Hono<{
    Bindings: Bindings;
    Variables: Variables;
}>();

blogRoutes.get("/blogs", async(c) => {

  let page = Number(c.req.query("page"))  || 1;
  let limit = Number(c.req.query("limit")) || 10;

  if(page < 1){
    page = 1;
  }
  if(limit < 1){
    limit = 10;
  }
  if(limit > 50){
    limit = 50;
  }

  const offset = (page - 1) * limit;

  const result = await c.env.mini_blog_db
    .prepare("SELECT * FROM blogs ORDER BY id DESC LIMIT ? OFFSET ? ")
    .bind(limit, offset)
    .all();
  const blogs = result.results as Blog[];

  const countResult = await c.env.mini_blog_db
    .prepare("SELECT COUNT(*) as total FROM blogs")
    .first() as { total: number };

  const totalPages = Math.ceil(countResult.total / limit);  

  return c.json({
    success: true,
    blogs,
    pagination: {
      page,limit,
      total: countResult.total,
      totalPages,
    },
  });
});

blogRoutes.get("/blogs/:id", async (c) => {
  const id = c.req.param("id");

  const blog = await c.env.mini_blog_db
    .prepare("SELECT * FROM blogs WHERE id = ?")
    .bind(id)
    .first() as Blog | null;

  if (!blog) {
    return c.json(
        {
          success: false,
          message: "Blog not found",
        },
        404
      );
  }  

  return c.json({
    success: true,
    blog,
  });
});  

blogRoutes.post("/blogs",authMiddleware, validate(blogSchema), async(c) => {

  const user = c.get("user");

  const body = c.get("validatedBody");

  await c.env.mini_blog_db
    .prepare(
      "INSERT INTO blogs (title, content, user_id) VALUES (?, ?, ?)"
    )
    .bind(body.title, body.content, user.id)
    .run()

  return c.json({
    message: "Blog created successfully",
  });

});

blogRoutes.put("/blogs/:id", authMiddleware, validate(blogSchema), async (c) => {
  
  const user = c.get("user");
    
  const id = c.req.param("id");

  const body = c.get("validatedBody");

  const blog = await c.env.mini_blog_db
  .prepare("SELECT * FROM blogs WHERE id = ?")
  .bind(id)
  .first() as Blog | null;

  if(!blog){
    return c.json(
      {
      success: false,
      message: "Blog not found",
    },
    404
  );
  }

  if(user.id !== blog.user_id){
    return c.json({
      success: false,
      message: "Permission declined"
    },
    403
  );
  }

  await c.env.mini_blog_db
    .prepare("UPDATE blogs SET title = ?, content = ? WHERE id = ?")
    .bind(body.title, body.content, id)
    .run();  

  return c.json({
    success: true,
    message: "Blog updated sucessfully",
  });

  
});


blogRoutes.delete("/blogs/:id", authMiddleware, async (c) => {

  const user = c.get("user");

  const id = c.req.param("id");

  const blog = await c.env.mini_blog_db
  .prepare("SELECT * FROM blogs WHERE id = ?")
  .bind(id)
  .first() as Blog | null;

  if(!blog){
    return c.json(
      {
        success: false,
        message: "Blog not found",
      },
      404
    );
  }

  if(user.id !== blog.user_id){
    return c.json({
      success: false,
      message: "Permission rejected"
    },
    403
    );
  }

  await c.env.mini_blog_db
  .prepare("DELETE FROM blogs WHERE id = ?")
  .bind(id)
  .run();

  return c.json(
    {
      success: true,
      message: "Blog deleted successfully"
    }
  );
  
});

export default blogRoutes;