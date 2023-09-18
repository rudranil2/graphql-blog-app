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

        • In the Query Resolver -> profile(userId: string) {} -> to get User info, we would have had to write another Resolver E.g. Profile and link it in the 'src/main.ts' file( where server is created) E.G. -> 

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

            We do not need to do that here, as inside the Query Resolver -> profile() -> We are including the user Details with Prisma include. So, When Querying for these, since these fields are being resolved, Apollo-Sandbox does not throw error!! 
        
            If it was not possible with Prisma to include the Relationships, then we would have had to write the 'Profile' Resolver separately and import it inside 'src/main.ts' as mentioned above. 


        • What Happens Normally? When you write Profile Resolver separately ? ( Gathered from QnA)

            When the Profile resolver is created, how is the connection made specifically to the profile query? Is it because "Profile" becomes a special keyword once it's defined as a type in the gql-schema?

            Yes the Profile name gets linked to the profile resolver. 

            This is the example Code for the separate profile resolver:
             
                import { Context } from "..";

                interface ProfileParentType {
                    id: number;
                    bio: string;
                    userId: number;
                }

                export const Profile = {    /*.....Resolving the user here...*/

                    user: ( parent: ProfileParentType, __: any, { prisma }: Context) => {
                        return prisma.user.findUnique({
                            where: {
                                id: parent.userId,
                            },
                        });
                    },
                };

            So, in the parent you will get the resolved document ( from query-profile Resolver ), and from 
            there we can get the userId and Query for the user.

            Linking happens this way

3. When you do not add separate resolvers E.G. Profile -> You can not have nested queries.


    query{
        posts {
            id
            title
            content
            author {
                email
                name
                posts {

                }
            }
        }
    }

    The inner Most posts{} fails if we do not add a separate resolver for Post E.g. -> 

            export const Post = {
                author: () => { //Resolves the post author }
            }

        schema.js :

            type Post {

                author: User!               //Separate resolver for this 
            }

        If we just simply include author -> when fetching posts -> 

            query{
                posts {
                    id
                    title
                    content
                    author {
                        email
                        name
                    }
                }
            }

        The query only works up to this level. But if we want to do -> author.posts{} it fails.

        So, we need to have separate resolvers for both -> 

        1.  type Post {
                author: User!
            }

        2.  type User {
                posts: [Post!]!
            }

        Adding Separate Resolvers will let us do any amount of nested queries E.G. -> 

        query{

            posts {
                id
                title
                content

                author {
                    email
                    name

                    posts {
                        title

                        author {
                            name
                            
                            posts {
                                content

                                author {
                                    id
                                    name
                                }
                            }
                        }
                    }
                }
            }
        } 