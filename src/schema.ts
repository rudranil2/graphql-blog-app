import { gql } from 'apollo-server';

const typeDefs = gql`
    type Query {
        posts: [Post!]!
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        createdAt: String!
        published: Boolean!
        author: User!
    }

    type User {
        id: ID!
        name: String!
        email: String!

        profile: Profile!
        posts: [Post!]!
    }

    type Profile {
        id: ID!
        bio: String!

        user: User!
    }

    type Mutation {
        postCreate(input: PostCreateInput!): PostPayload!
        postUpdate(id: ID!, input: PostCreateInput!): PostPayload!
        postDelete(id: ID!): PostPayload!
    }

    input PostCreateInput {         # Based on Principle no 14 - relaxing required constraints
        title: String
        content: String
        # authorId: ID!
    }

    type UserError{
        message: String!
    }

    type PostPayload {
        userErrors: [UserError!]
        post: Post
    }

`

export default typeDefs;