import { Post } from "@prisma/client";
import { Context, ProfilePayloadType, UserPayloadType } from "../types";

export const Query = {
    posts: async( _ : any, __: any, { prisma }: Context): Promise<Post[]> => {
        return await prisma.post.findMany({
            where: {
                deletedAt: null
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    },
    me: async ( _: any, __ : any, { prisma, currentUser  }: Context): Promise<UserPayloadType> => {
        if(!currentUser){
            return {
                userErrors: [{
                    message: `401 - Unauthorized Access - No Token provided`
                }],
                user: null
            }
        }

        const user = await prisma.user.findFirst({
            where: { 
                id: currentUser.sub, 
                deletedAt: null 
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true
            }
        });

        if(!user)
            return {
                userErrors: [{
                    message: `401 - Invalid Token`
                }],
                user: null
            }

        return {
            userErrors: null,
            user
        }
    },
    profile: async ( _: any, { userId }: { userId: string } , { prisma }: Context ) : Promise<ProfilePayloadType> => {
        const profile = await prisma.profile.findFirst({
            where: {
                deletedAt: null,
                userId: Number(userId)
            },
        });

        if(!profile){
            return {
                userErrors: [{
                    message: `404 - Profile not found`
                }],
                profile: null
            }
        }

        return {
            userErrors: null,
            profile
        }
    }
}