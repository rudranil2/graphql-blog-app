import { Context } from "../types";
import { PostPayloadType } from "../types";

interface PostCreateArgs {
    title: string
    content: string
}

export const Mutation = {
    postCreate: async ( _: any, { input } : { input: PostCreateArgs}, { prisma }: Context): Promise<PostPayloadType> => {

        const { title, content } = input;

        if(!title || !content){
            return {
                userErrors: [{
                    message: `Title & Content are required fields`
                }],
                post: null
            }
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: 1
            }
        });

        return {
            userErrors: null,
            post
        }
    },
    postUpdate: async ( _: any, { id, input } : { id: string, input: PostCreateArgs}, { prisma }: Context): Promise<PostPayloadType> => {

        const post = await prisma.post.findFirst({
            where: { 
                id: Number(id),
                deletedAt: null
            }
        });

        if(!post){
            return {
                userErrors: [{
                    message: `Post with id: ${id} not found`
                }],
                post: null
            }
        }

        const { title, content } = input;

        const updatedPost = await prisma.post.update({
            where: { id: post.id },
            data: {
                title: title || post.title,
                content: content || post.content,
            }
        });

        return {
            userErrors: null,
            post: updatedPost
        }
    },
    postDelete: async ( _: any, { id } : { id: string }, { prisma }: Context): Promise<PostPayloadType> => {

        const post = await prisma.post.findFirst({
            where: { 
                id: Number(id),
                deletedAt: null
            }
        });

        if(!post){
            return {
                userErrors: [{
                    message: `Post with id: ${id} not found`
                }],
                post: null
            }
        }

        const updatedPost = await prisma.post.update({
            where: { id: post.id },
            data: {
                deletedAt: new Date()
            }
        });

        return {
            userErrors: null,
            post: updatedPost
        }
    }
}