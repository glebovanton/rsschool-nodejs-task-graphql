import {
    GraphQLFloat,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLList,
    GraphQLString,
    GraphQLInputObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { Profile } from './profile.js';
import { Post } from './post.js';

export const User = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
        id: { type: new GraphQLNonNull(UUIDType) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        profile: { type: Profile },
        posts: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))) },
        userSubscribedTo: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
        },
        subscribedToUser: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
        },
    }),
});

export interface ICreateUserInput {
    balance: number;
    name: string;
}
export interface IChangeUserInput {
    balance?: number;
    name?: string;
}
export const CreateUserInput = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: {
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
        name: { type: new GraphQLNonNull(GraphQLString) },
    },
});

export const ChangeUserInput = new GraphQLInputObjectType({
    name: 'ChangeUserInput',
    fields: {
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
    },
});
