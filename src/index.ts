import { ApolloServer } from 'apollo-server';
import typeDefs from './schema';
import { Mutation, Query } from './resolvers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation
    },
    context: {
        prisma
    }
});

server.listen().then(({ url }) => {
    console.log(`Server running at url ${url}`);
})

// hnI25NjaYIDEHIfg

// postgresql://postgres:hnI25NjaYIDEHIfg@db.ulgttqyabrnyftmuwevg.supabase.co:5432/postgres