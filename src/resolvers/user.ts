import { Post, Prisma, User as PrismaUserType } from "@prisma/client";
import { Context } from "../types";

export const User = {
    posts: async( parent : PrismaUserType, _ : any, { prisma, currentUser }: Context): Promise<Post[]> => {
        const { id: authorId } = parent;

        const whereInput: Prisma.PostWhereInput = {
            deletedAt: null,
            authorId
        }

        if(authorId !== currentUser?.sub){
            whereInput.published = true;
        }

        return await prisma.post.findMany({
            where: whereInput,
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
}