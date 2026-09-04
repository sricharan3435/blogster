import { createMiddleware } from "hono/factory";
import { success } from "zod";

export const validateBlogId = createMiddleware(async (c, next) => {
    const id = Number(c.req.param("id"));

    if(!Number.isInteger(id) || id < 1) {
        return c.json(
            {
                success: false,
                message: "Invalid blog ID",
            },
            400
        );
    }
    c.set("blogId", id);
    await next();
});