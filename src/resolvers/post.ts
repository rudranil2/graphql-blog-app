import { Prisma, Post as PrismaPostType, User } from "@prisma/client";
import { Context } from "../types";
import userLoader from "../loaders/userLoader";

export const Post = {
    author: async( parent : PrismaPostType, __: any, { prisma }: Context): Promise<User | null> => {

        const { authorId } = parent;

        return await userLoader.load(authorId);

        /* 
         * Data-Loader overall concept 
            This catches how many unique id's are the userLoader is called with -> That's how it figures out the id[]
            When the userLoader is called, it uses the 'batchUsers()' we provided it with. [The array -> Map construction is necessary! ]
            For the 1st time when server starts, it makes the DB call and caches all the data that was passed to it.
            Next time, when userLoader is called, it finds out the id's that are not stored inside of it. ( Used console log inside batchUsers() -> to see which id's are passed to it -> the previous cached one's were not present )
            It only makes the db call if data is not present inside of it's cache. -> Stored in memory

            E.G. : 

                [ 5 ]
                [ 1 ]

                [nodemon] restarting due to changes...
                [nodemon] starting `npx ts-node-dev ./src/main.ts`
                [INFO] 17:25:53 ts-node-dev ver. 2.0.0 (using ts-node ver. 10.9.1, typescript ver. 5.2.2)
                Server running at url http://localhost:4000/
                [ 5, 1 ]

            ---Made 20 requests here...nothing was printed as all of them were cached inside DataLoader

        */

    }
}