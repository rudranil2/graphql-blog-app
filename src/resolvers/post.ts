import { Prisma, Post as PrismaPostType, User } from "@prisma/client";
import { Context } from "../types";

export const Post = {
    author: async( parent : PrismaPostType, __: any, { prisma }: Context): Promise<User | null> => {

        const { authorId } = parent;

        return await prisma.user.findFirst({
            where: {
                deletedAt: null,
                id: authorId
            }
        });
    }
}