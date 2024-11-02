import { MemberType, MemberTypeId } from './types/member.js';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { Post } from './types/post.js';
import { UUIDType } from './types/uuid.js';
import { User } from './types/user.js';
import { Profile } from "./types/profile.js";

interface GraphQLContext {
    prisma: PrismaClient;
}

const Query: GraphQLObjectType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        memberTypes: {
            type: new GraphQLNonNull(new GraphQLList(MemberType)),
            resolve: async (_source, _args, { prisma }: GraphQLContext) => {
                return prisma.memberType.findMany();
            },
        },

        memberType: {
            type: MemberType,
            args: {
                id: { type: new GraphQLNonNull(MemberTypeId) },
            },
            resolve: async (_source, { id }: { id: string }, { prisma }: GraphQLContext) => {
                return prisma.memberType.findUnique({ where: {id} });
            },
        },

        posts: {
            type: new GraphQLNonNull(new GraphQLList(Post)),
            resolve: async (_source, _args, { prisma }: GraphQLContext) => {
                return prisma.post.findMany();
            },
        },

        post: {
            type: Post,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (_source, { id }:{ id: string }, { prisma }: GraphQLContext) =>
                await prisma.post.findUnique({ where: { id } }),
        },

        users: {
            type: new GraphQLNonNull(new GraphQLList(User)),
            resolve: async (_source, _args, { prisma }: GraphQLContext) => {
                return prisma.user.findMany();
            },
        },

        user: {
            type: User as GraphQLObjectType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (_, arg: { id: string }, { prisma }: GraphQLContext) =>
                await prisma.user.findUnique({
                    where: { id: arg.id }
                }),
        },
        profiles: {
            type: new GraphQLList(Profile),
            resolve: async (_source, _args, { prisma }: GraphQLContext) => {
                return prisma.profile.findMany();
            },
        },
        profile: {
            type: Profile,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_source, { id }: { id: string }, { prisma }: GraphQLContext) => {
                return prisma.profile.findUnique({ where: {id} });
            },
        },
    },
});

export default Query;
