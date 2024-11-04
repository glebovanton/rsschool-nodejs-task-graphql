import { MemberType, MemberTypeId } from './types/member.js';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLType } from 'graphql';
import { parseResolveInfo, ResolveTree, simplify } from 'graphql-parse-resolve-info';
import { Post } from './types/post.js';
import { UUIDType } from './types/uuid.js';
import { User } from './types/user.js';
import { Profile } from "./types/profile.js";
import { GraphQLContext } from './index.js';

const Query: GraphQLObjectType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        memberTypes: {
            type: new GraphQLNonNull(new GraphQLList(MemberType)),
            resolve: async (_source, _args, { loaders, prisma }: GraphQLContext) => {
                const memberTypes = await prisma.memberType.findMany();

                memberTypes.forEach((memberType) =>
                    loaders.memberTypeLoader.prime(memberType.id, memberType),
                );

                return memberTypes;
            },
        },

        memberType: {
            type: MemberType,
            args: {
                id: { type: new GraphQLNonNull(MemberTypeId) },
            },
            resolve: async (_source, { id }: { id: string }, { loaders }: GraphQLContext) => {
                return loaders.memberTypeLoader.load(id);
            },
        },

        posts: {
            type: new GraphQLNonNull(new GraphQLList(Post)),
            resolve: async (_source, _args, { loaders, prisma }: GraphQLContext) => {
                const posts = await prisma.post.findMany();

                posts.forEach(post => loaders.postLoader.prime(post.id, post));

                return posts;
            },
        },

        post: {
            type: Post,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (_source, { id }:{ id: string }, { loaders }: GraphQLContext) => {
                return  loaders.postLoader.load(id);
            }
        },

        users: {
            type: new GraphQLNonNull(new GraphQLList(User)),
            resolve: async (_source, _args, { loaders, prisma }: GraphQLContext, info) => {
                const parsedInfo = parseResolveInfo(info);
                const include: {
                    userSubscribedTo?: boolean;
                    subscribedToUser?: boolean;
                } = {};

                if (parsedInfo) {
                    const simplifiedInfo = simplify(parsedInfo as ResolveTree, User as GraphQLType);
                    const fields: { [key: string]: boolean } = simplifiedInfo.fields;

                    if (fields.userSubscribedTo) include['userSubscribedTo'] = true;
                    if (fields.subscribedToUser) include['subscribedToUser'] = true;
                }

                const users = await prisma.user.findMany({ include });

                users.forEach((user) => {
                    loaders.userLoader.prime(user.id, user);

                    if (include.userSubscribedTo && user.userSubscribedTo) {
                        const userSubscribedToIds = user.userSubscribedTo.map(
                            (sub) => sub.authorId,
                        );
                        const userSubscribedToArr = users.filter((user) =>
                            userSubscribedToIds.includes(user.id),
                        );
                        loaders.userSubscribedToLoader.prime(user.id, userSubscribedToArr);
                    }

                    if (include.subscribedToUser && user.subscribedToUser) {
                        const subscribedToUserIds = user.subscribedToUser.map(
                            (sub) => sub.subscriberId,
                        );
                        const subscribedToUserArr = users.filter((user) =>
                            subscribedToUserIds.includes(user.id),
                        );
                        loaders.subscribedToUserLoader.prime(user.id, subscribedToUserArr);
                    }
                });

                return users;
            },
        },

        user: {
            type: User as GraphQLObjectType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (_, { id }: { id: string }, { loaders }: GraphQLContext) =>
                loaders.userLoader.load(id),
        },

        profiles: {
            type: new GraphQLList(Profile),
            resolve: async (_source, _args, { loaders, prisma }: GraphQLContext) => {
                const profiles = await prisma.profile.findMany();
                profiles.forEach((profile) =>
                    loaders.profileLoader.prime(profile.id, profile),
                );

                return profiles;
            },
        },

        profile: {
            type: Profile,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_source, { id }: { id: string }, { loaders }: GraphQLContext) => {
                return loaders.profileLoader.load(id)
            },
        },
    },
});

export default Query;
