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
    }
}