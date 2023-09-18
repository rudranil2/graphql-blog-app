import { User } from "@prisma/client";
import DataLoader from "dataloader";
import { prisma } from "../main";

type BatchUser = (ids: number[]) => Promise<User[]>

const batchUsers: BatchUser = async (ids) => {
    console.log(ids);
    const users = await prisma.user.findMany({
        where: {
            id: {
                in: ids
            }
        }
    });

    const userMap: { [key: string]: User } = {}

    users.forEach((user) => {
        userMap[user.id] = user
    })


    return ids.map(el => userMap[el]);
}

//@ts-ignore
const userLoader = new DataLoader<number, User>(batchUsers);
export default userLoader;