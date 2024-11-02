import {
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInputObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeId } from './member.js';

export const Profile = new GraphQLObjectType({
    name: 'Profile',
    fields: {
        id: { type: new GraphQLNonNull(UUIDType) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        memberType: { type: new GraphQLNonNull(MemberType) },
    },
});

export interface ICreateProfileInput {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
    userId: string;
}
export interface IChangeProfileInput {
    isMale?: boolean;
    memberTypeId?: string;
    yearOfBirth?: number;
}

export const CreateProfileInput = new GraphQLInputObjectType({
    name: 'CreateProfileInput',
    fields: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    },
});

export const ChangeProfileInput = new GraphQLInputObjectType({
    name: 'ChangeProfileInput',
    fields: {
        isMale: { type: GraphQLBoolean },
        memberTypeId: { type: MemberTypeId },
        yearOfBirth: { type: GraphQLInt },
    },
});
