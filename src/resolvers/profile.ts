import { Profile as PrismaProfileType, User } from "@prisma/client";
import { Context } from "../types";

export const Profile = {
    user: async( parent : PrismaProfileType, __: any, { prisma }: Context): Promise< User | null> => {

        const { userId } = parent;

        return await prisma.user.findFirst({
            where: {
                deletedAt: null,
                id: userId
            }
        })
    }
}