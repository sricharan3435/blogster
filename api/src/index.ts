import { Hono } from "hono";
import { sign } from "hono/jwt";
import { authMiddleware } from "./middleware/auth";

type Bindings = {
  mini_blog_db: D1Database;
  JWT_SECRET: string
};

type Variables = {
  user: any;
};

const app = new Hono<{ 
  Bindings: Bindings;
  Variables : Variables; 
}>();


app.get("/blogs", async(c) => {
  const blogs = await c.env.mini_blog_db
    .prepare("SELECT * FROM blogs")
    .all();

  return c.json(blogs);
});

app.get("/blogs/:id", async (c) => {
  const id = c.req.param("id");

  const blog = await c.env.mini_blog_db
    .prepare("SELECT * FROM blogs WHERE id = ?")
    .bind(id)
    .first();

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

app.post("/blogs",authMiddleware, async(c) => {

  const user = c.get("user");

  const body = await c.req.json();

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

app.put("/blogs/:id", authMiddleware, async (c) => {
  
  const user = c.get("user");
    
  const id = c.req.param("id");

  const body = await c.req.json();

  const blog = await c.env.mini_blog_db
  .prepare("SELECT * FROM blogs WHERE id = ?")
  .bind(id)
  .first();

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


app.delete("/blogs/:id", authMiddleware, async (c) => {

  const user = c.get("user");

  const id = c.req.param("id");

  const blog = await c.env.mini_blog_db
  .prepare("SELECT * FROM blogs WHERE id = ?")
  .bind(id)
  .first();

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



//Authenticatoin starts from here

app.post("/register", async(c) => {
  const body = await c.req.json();

  const user = await c.env.mini_blog_db
  .prepare("SELECT * FROM users WHERE email = ?")
  .bind(body.email)
  .first();

  if(user){
    return c.json(
      {
        success: false,
        message: "User already exists"
      },
      409
    );
  }

  await c.env.mini_blog_db
  .prepare("INSERT INTO users (name, email, password) VALUES(?, ?, ?)")
  .bind(body.name, body.email, body.password)
  .run();

  return c.json({
    success: true,
    message: "User registered successfully",
  });

});


app.post("/login", async(c) => {
  const body = await c.req.json();

  const user = await c.env.mini_blog_db
  .prepare("SELECT * FROM users WHERE email = ?")
  .bind(body.email)
  .first();

  if(!user){
    return c.json({
      success: false,
      message: "User not found"
    },
    404
  );
}

  if(body.password !== user.password){
    return c.json({
      success: false,
      message: "Invalid password"
    },
    401
  );
}

  const token = await sign(
    {
      id: user.id,
    },
    c.env.JWT_SECRET
  );

  return c.json({
    success: true,
    message: "Login Successful",
    token: token,
  });

});


export default app;
