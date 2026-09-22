import { Hono } from "hono";
import { sign } from "hono/jwt";
import type { Bindings, Variables, User } from "../types";
import { registerSchema, loginSchema } from "../schemas/auth";
import { validate } from "../middleware/validate";
import { hash, compare } from "bcryptjs";

const authRoutes = new Hono<{
    Bindings: Bindings;
    Variables: Variables;
}>();


authRoutes.post("/register", validate(registerSchema), async(c) => {

  const body = c.get("validatedBody");

  const user = await c.env.mini_blog_db
  .prepare("SELECT * FROM users WHERE email = ?")
  .bind(body.email)
  .first() as User | null;

  if(user){
    return c.json(
      {
        success: false,
        message: "User already exists"
      }, 
      409
    );
  }

  const hashedPassword = await hash(body.password, 10);

  await c.env.mini_blog_db
  .prepare("INSERT INTO users (name, email, password, created_at) VALUES(?, ?, ?, CURRENT_TIMESTAMP)")
  .bind(body.name, body.email, hashedPassword)
  .run();

  return c.json({
    success: true,
    message: "User Registered Successfully",
  });

});


authRoutes.post("/login", validate(loginSchema), async(c) => {

  const body = c.get("validatedBody");

  const user = await c.env.mini_blog_db
  .prepare("SELECT * FROM users WHERE email = ?")
  .bind(body.email)
  .first() as User | null;

  if(!user){
    return c.json({
      success: false,
      message: "User not found"
    },
    404
  );
}

  const isPasswordCorrect = await compare(
    body.password,
    user.password 
  );

  if(!isPasswordCorrect){
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
    user: { id: user.id, name: user.name, email: user.email },
  });

});




export default authRoutes;
