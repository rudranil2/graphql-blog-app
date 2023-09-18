import { Post, User as PrismaUserType } from "@prisma/client";
import { Context } from "../types";

export const User = {
    posts: async( parent : PrismaUserType, _ : any, { prisma }: Context): Promise<Post[]> => {
        const { id: authorId } = parent;

        return await prisma.post.findMany({
            where: {
                deletedAt: null,
                authorId
            }
        })

    }
}