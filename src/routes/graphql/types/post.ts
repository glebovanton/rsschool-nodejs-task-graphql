import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInputObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';

export const Post = new GraphQLObjectType({
    name: 'Post',
    fields: {
        content: { type: new GraphQLNonNull(GraphQLString) },
        id: { type: new GraphQLNonNull(UUIDType) },
        title: { type: new GraphQLNonNull(GraphQLString) },
    },
});

export interface ICreatePostInput {
    authorId: string;
    content: string;
    title: string;
}
export interface IChangePostInput {
    content?: string;
    title?: string;
}

export const CreatePostInput = new GraphQLInputObjectType({
    name: 'CreatePostInput',
    fields: {
        authorId: { type: new GraphQLNonNull(UUIDType) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
    },
});

export const ChangePostInput = new GraphQLInputObjectType({
    name: 'ChangePostInput',
    fields: {
        content: { type: GraphQLString },
        title: { type: GraphQLString },
    },
});
