import { createMiddleware } from "hono/factory";
import { z, type ZodType } from "zod";

export function validate<T extends ZodType>(schema: T){

    return createMiddleware<{
        Variables: {
            validatedBody: z.infer<T>;
        };
    }>(
        async (c, next) => {
        const body = await c.req.json();

        const result = schema.safeParse(body);

        if(!result.success) {
            return c.json(
                {
                    success: false,
                    message: "Invalid Input",
                    errors: result.error.issues,
                },
                400
            );
        }

        c.set("validatedBody", result.data);

        await next();
        }    
    );
}
