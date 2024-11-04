import DataLoader from 'dataloader';
import { PrismaClient, MemberType as PrismaMemberType, Profile, Post, User } from '@prisma/client';

const prisma = new PrismaClient();

export type Loaders = {
    memberTypeLoader: DataLoader<string, PrismaMemberType | null, string>;
    postByIdLoader: DataLoader<string, Post[] | [], string>;
    postLoader: DataLoader<string, Post | null, string>;
    profileByIdLoader: DataLoader<string, Profile | null, string>;
    profileLoader: DataLoader<string, Profile | null, string>;
    userLoader: DataLoader<string, User | null, string>;
    userSubscribedToLoader: DataLoader<string, User[] | [], string>;
    subscribedToUserLoader: DataLoader<string, User[] | [], string>;
};

export const memberTypeLoader = new DataLoader<string, PrismaMemberType | null>(async (memberTypeIds)=> {
    const memberTypes = await prisma.memberType.findMany({
        where: { id: { in: [...memberTypeIds] } },
    });
    const memberTypeMap = new Map(
        memberTypes.map((memberType) => [memberType.id, memberType]),
    );

    return memberTypeIds.map((id) => memberTypeMap.get(id) || null);
});

export const profileByIdLoader = new DataLoader(async (ids: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
        where: { userId: { in: [...ids] } },
    });
    const profilesMap = new Map<string, Profile>(
        profiles.map((profile) => [profile.userId, profile]),
    );

    return ids.map((userId) => profilesMap.get(userId) || null);
});

const profileLoader = new DataLoader(async (userIds: readonly string[]) => {
    const profiles = await prisma.profile.findMany({ where: { id: { in: [...userIds] } } });
    const profilesMap = new Map(profiles.map((profile) => [profile.id, profile]));

    return userIds.map((id) => profilesMap.get(id) || null);
});

export const postByIdLoader = new DataLoader(async (authorIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
        where: { authorId: { in: [...authorIds] } },
    });
    const postsMap = new Map<string, Post[]>(authorIds.map((authorId) => [authorId, []]));

    posts.forEach((post) => {
        if (post.authorId) postsMap.get(post.authorId)?.push(post);
    });

    return authorIds.map((authorId) => postsMap.get(authorId) || []);
});

export const postLoader = new DataLoader(async (ids: readonly string[]) => {
    const posts = await prisma.post.findMany({ where: { id: { in: [...ids] } } });
    const postsMap = new Map(posts.map((post) => [post.id, post]));

    return ids.map((id) => postsMap.get(id) || null);
});

export const userLoader = new DataLoader(async (ids: readonly string[]) => {
    const users = await prisma.user.findMany({ where: { id: { in: [...ids] } } });
    const usersMap = new Map(users.map((user) => [user.id, user]));

    return ids.map((id) => usersMap.get(id) || null);
});

export const userSubscribedToLoader = new DataLoader(async (userIds: readonly string[]) => {
    const users = await prisma.user.findMany({
        where: { subscribedToUser: { some: { subscriberId: { in: [...userIds] } } } },
        include: { subscribedToUser: true },
    });

    const usersMap = new Map<string, User[]>(userIds.map((id) => [id, []]));

    users.forEach((user) => {
        user.subscribedToUser.forEach((subscriber) => {
            usersMap.get(subscriber.subscriberId)?.push(user);
        });
    });

    return userIds.map((id) => usersMap.get(id) || []);
});

export const subscribedToUserLoader = new DataLoader(async (userIds: readonly string[]) => {
    const users = await prisma.user.findMany({
        where: { userSubscribedTo: { some: { authorId: { in: [...userIds] } } } },
        include: { userSubscribedTo: true },
    });
    const usersMap = new Map<string, User[]>(userIds.map((id) => [id, []]));

    users.forEach((user) => {
        user.userSubscribedTo.forEach((subscription) => {
            usersMap.get(subscription.authorId)?.push(user);
        });
    });

    return userIds.map((id) => usersMap.get(id) || []);
});

export const createLoaders : () => Loaders = () => ({
    memberTypeLoader,
    profileByIdLoader,
    profileLoader,
    postLoader,
    userLoader,
    userSubscribedToLoader,
    postByIdLoader,
    subscribedToUserLoader
});

