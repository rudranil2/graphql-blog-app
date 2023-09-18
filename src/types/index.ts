import { Post, Profile, User } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
    currentUser: JWTInfo | null
}

export interface PostPayloadType {
    userErrors: UserError[] | null  //  {}[] -> Empty Array of objects
    post: Post | null
}

export interface UserError{
    message: string
}

export interface SignInPayload {
    email: string
    password: string
}

export interface SignUpPayload extends SignInPayload {
    name: string
    bio?: string
}

export interface AuthPayloadType {
    userErrors: UserError[] | null  //  {}[] -> Empty Array of objects
    token: string | null
}

export interface PayloadErrorType {
    error: Boolean, 
    userErrors: UserError[]
}

export interface JWTPayload {
    sub: number, 
    email: string,
}

export interface JWTInfo extends JWTPayload{
    iat: number, 
    exp: number
}

export interface UserPayloadType {
    userErrors: UserError[] | null  //  {}[] -> Empty Array of objects
    user: Omit<User, 'password'> | null
}

export interface ProfilePayloadType {
    userErrors: UserError[] | null  
    profile: Profile | null
}