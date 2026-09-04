export type Bindings = {
    mini_blog_db: D1Database;
    JWT_SECRET: string;
};

export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
};

export type AuthUser = {
    id: number;
};

export type Blog = {
    id: number;
    title: string;
    content: string;
    created_at: string;
    user_id: number;
};

export type Variables = {
    user: AuthUser;
    validatedBody: unknown;
    blogId: number;
};

export type BlogWithAuthor = Blog & {
    author_name: string;
};