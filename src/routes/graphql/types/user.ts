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
import { GraphQLContext } from '../index.js';

export const User = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
        id: { type: new GraphQLNonNull(UUIDType) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        profile: {
            type: Profile,
            resolve: async ({ id} : { id: string }, _args, { loaders }: GraphQLContext) => {
                return loaders.profileByIdLoader.load(id);
            },
        },
        posts: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
            resolve: async ({ id }: { id: string }, _args, { loaders }: GraphQLContext) => {
                return loaders.postByIdLoader.load(id);
            },
        },
        userSubscribedTo: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
            resolve: async ({ id }: { id: string }, _args, { loaders }: GraphQLContext) => {
                return loaders.userSubscribedToLoader.load(id);
            },
        },
        subscribedToUser: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
            resolve: async ({ id }: { id: string }, _args, { loaders }: GraphQLContext) => {
                return loaders.subscribedToUserLoader.load(id);
            },
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
