import { Context, PostPayloadType } from "../../types";

interface PostCreateArgs {
    title: string
    content: string
}


const postResolvers = {
    postCreate: async ( _: any, { input } : { input: PostCreateArgs}, { prisma, currentUser }: Context): Promise<PostPayloadType> => {

        if(!currentUser)
            return {
                userErrors: [{
                    message: `401 - Unauthorized Access`
                }],
                post: null
            }

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
                authorId: Number(currentUser.sub)
            }
        });

        return {
            userErrors: null,
            post
        }
    },
    postUpdate: async ( _: any, { id, input } : { id: string, input: PostCreateArgs}, { prisma, currentUser }: Context): Promise<PostPayloadType> => {

        if(!currentUser)
            return {
                userErrors: [{
                    message: `401 - Unauthorized Access`
                }],
                post: null
            }

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

        if(post.authorId !== currentUser.sub)
            return {
                userErrors: [{
                    message: `403 - Forbidden Access`
                }],
                post: null
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
    postDelete: async ( _: any, { id } : { id: string }, { prisma , currentUser}: Context): Promise<PostPayloadType> => {

        if(!currentUser)
            return {
                userErrors: [{
                    message: `401 - Unauthorized Access`
                }],
                post: null
            }
        
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

        if(post.authorId !== currentUser.sub)
            return {
                userErrors: [{
                    message: `403 - Forbidden Access`
                }],
                post: null
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
    },
    postPublishUnPublish: async ( _: any, { id } : { id: string }, { prisma , currentUser}: Context): Promise<PostPayloadType> => {
        if(!currentUser)
        return {
            userErrors: [{
                message: `401 - Unauthorized Access`
            }],
            post: null
        }
    
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

        if(post.authorId !== currentUser.sub)
            return {
                userErrors: [{
                    message: `403 - Forbidden Access`
                }],
                post: null
            }

        const updatedPost = await prisma.post.update({
            where: { id: post.id },
            data: {
                published: !post.published
            }
        });

        return {
            userErrors: null,
            post: updatedPost
        }

    }
}

export default postResolvers;