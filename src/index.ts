import { ApolloServer } from 'apollo-server';
import typeDefs from './schema';
import { Query } from './resolvers';

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query
    }
});

server.listen().then(({ url }) => {
    console.log(`Server running at url ${url}`);
})

// hnI25NjaYIDEHIfg

// postgresql://postgres:hnI25NjaYIDEHIfg@db.ulgttqyabrnyftmuwevg.supabase.co:5432/postgres