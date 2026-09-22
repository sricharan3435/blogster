import {verify} from "hono/jwt";

export async function authMiddleware(c: any, next: any) {

    const authHeader = c.req.header("Authorization");

    if(!authHeader) {
        return c.json(
            {
                success: false,
                message: "Authorization header missing"
            },
            401
        );
    }

    const token = authHeader.split(" ")[1];

    try{
        const payload = await verify(token, c.env.JWT_SIGNING_SECRET, "HS256");

        c.set("user", payload);

        await next();
    }
    catch(error){
        console.log(error);
        return c.json(
            {
                success: false,
                message: "Invalid token"
            },
            401
        )
    }
}
