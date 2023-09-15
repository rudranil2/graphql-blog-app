1.
    type User {
        id: ID!
        name: String!
        email: String!

        profile: Profile!
        posts: [Post!]!
    }

    Removing 'profile' field as We don't want to query the Profile from /me route. Instead, We can Query for a profile and then get the User Info from there. E.G. -> 

        type Profile {
            id: ID!
            bio: String!

            user: User!
        }

2. 
    Profile Resolver -> 
        In the Query Resolver -> profile() -> to get User info, we would have had to write another Resolver E.g. Profile and link it in the 'src/main.ts' file( where server is created) E.G. -> 

        'src/main.ts':

            const server = new ApolloServer({
                typeDefs,
                resolvers: {
                    Query,
                    Mutation,
                    Profile       # RIGHT HERE
                },
                ...
            }

        We do not need to do that here, as inside the Query Resolver -> profile() -> We are including the user Details with Prisma. So, When Querying for these, since these fields are being resolved, Apollo-Sandbox does not throw error!! 
        
        If it was not possible with Prisma to include the Relationships, then we would have had to write the 'Profile' Resolver separately and import it inside 'src/main.ts' as mentioned above. 