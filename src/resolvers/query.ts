import { Post } from "@prisma/client";
import { Context, UserPayloadType } from "../types";

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
    me: async ( _: any, __ : any, { prisma, currentUser  }: Context ) : Promise<UserPayloadType> => {
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
                id: Number(currentUser.sub), 
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
    }
}