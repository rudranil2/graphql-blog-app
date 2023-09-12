import { Post } from '@prisma/client';
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