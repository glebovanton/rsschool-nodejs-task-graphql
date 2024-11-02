import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLString } from 'graphql';
import { PrismaClient } from '@prisma/client';

import {
    User,
    CreateUserInput,
    ICreateUserInput,
    ChangeUserInput,
    IChangeUserInput,
} from './types/user.js';
import {
    Profile,
    CreateProfileInput,
    ICreateProfileInput,
    ChangeProfileInput,
    IChangeProfileInput,
} from './types/profile.js';
import {
    ChangePostInput,
    CreatePostInput,
    IChangePostInput,
    ICreatePostInput,
    Post,
} from './types/post.js';
import { UUIDType } from './types/uuid.js';

export interface GraphQLContext {
    prisma: PrismaClient;
}

const Mutations = new GraphQLObjectType({
    name: 'Mutations',
    fields: {
        createUser: {
            type: new GraphQLNonNull(User),
            args: {
                dto: { type: new GraphQLNonNull(CreateUserInput) },
            },
            resolve: async (_source, { dto }: { dto: ICreateUserInput }, { prisma }: GraphQLContext) => {
                return prisma.user.create({
                    data: { name: dto.name, balance: dto.balance },
                });
            },
        },

        createProfile: {
            type: new GraphQLNonNull(Profile),
            args: {
                dto: { type: new GraphQLNonNull(CreateProfileInput) },
            },
            resolve: async (
                _source,
                { dto }: { dto: ICreateProfileInput },
                { prisma }: GraphQLContext,
            ) => {
                return prisma.profile.create({data: dto});
            },
        },

        createPost: {
            type: new GraphQLNonNull(Post),
            args: {
                dto: { type: new GraphQLNonNull(CreatePostInput) },
            },
            resolve: async (_source, { dto }: { dto: ICreatePostInput }, { prisma }: GraphQLContext) => {
                return prisma.post.create({data: dto});
            },
        },

        changePost: {
            type: new GraphQLNonNull(Post),
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(ChangePostInput) },
            },
            resolve: async (
                _source,
                { id, dto }: { id: string; dto: IChangePostInput },
                { prisma }: GraphQLContext,
            ) => {
                return prisma.post.update({where: {id}, data: dto});
            },
        },

        changeProfile: {
            type: new GraphQLNonNull(Profile),
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(ChangeProfileInput) },
            },
            resolve: async (
                _source,
                { id, dto }: { id: string; dto: IChangeProfileInput },
                { prisma }: GraphQLContext,
            ) => {
                return prisma.profile.update({where: {id}, data: dto});
            },
        },

        changeUser: {
            type: new GraphQLNonNull(User),
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(ChangeUserInput) },
            },
            resolve: async (
                _source,
                { id, dto }: { id: string; dto: IChangeUserInput },
                { prisma }: GraphQLContext,
            ) => {
                return prisma.user.update({where: {id}, data: dto});
            },
        },

        deleteUser: {
            type: new GraphQLNonNull(GraphQLString),
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (_source, { id }: { id: string }, { prisma }: GraphQLContext) => {
                await prisma.user.delete({ where: { id } });
                return 'User deleted successfully';
            },
        },

        deletePost: {
            type: new GraphQLNonNull(GraphQLString),
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (_source, { id }: { id: string }, { prisma }: GraphQLContext) => {
                await prisma.post.delete({ where: { id } });
                return 'Post deleted successfully';
            },
        },

        deleteProfile: {
            type: new GraphQLNonNull(GraphQLString),
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (_source, { id }: { id: string }, { prisma }: GraphQLContext) => {
                await prisma.profile.delete({ where: { id } });
                return 'Profile deleted successfully';
            },
        },

        subscribeTo: {
            type: new GraphQLNonNull(User),
            args: {
                userId: { type: new GraphQLNonNull(UUIDType) },
                authorId: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (
                _source,
                { userId, authorId }: { userId: string; authorId: string },
                { prisma }: GraphQLContext
            ) => {
                return prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        userSubscribedTo: {
                            create: {
                                authorId: authorId,
                            },
                        },
                    },
                });
            },
        },

        unsubscribeFrom: {
            type: GraphQLBoolean,
            args: {
                userId: { type: new GraphQLNonNull(UUIDType) },
                authorId: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (
                _source,
                { userId, authorId }: { userId: string; authorId: string },
                { prisma }: GraphQLContext
            ) => {
                try {
                    await prisma.subscribersOnAuthors.delete({
                        where: {
                            subscriberId_authorId: {
                                subscriberId: userId,
                                authorId: authorId,
                            },
                        },
                    });

                    return true;
                } catch {
                    return false;
                }
            },
        },
    },
});

export default Mutations;
