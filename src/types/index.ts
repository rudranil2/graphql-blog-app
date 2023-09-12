import { Post, User } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}

export interface PostPayloadType {
    userErrors: UserError[] | null  //  {}[] -> Empty Array of objects
    post: Post | null
}

export interface UserError{
    message: string
}

interface SignInPayload {
    email: string
    password: string
}

export interface SignUpPayload extends SignInPayload {
    name: string
    bio?: string
}

export interface UserPayloadType {
    userErrors: UserError[] | null  //  {}[] -> Empty Array of objects
    user: User | null
}