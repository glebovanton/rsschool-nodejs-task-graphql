import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql';
import Query from './query.js';
import Mutations from './mutations.js';

const query: GraphQLObjectType = Query;
const mutation: GraphQLObjectType = Mutations;

const schema: GraphQLSchema = new GraphQLSchema({
  query,
  mutation,
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { prisma } = fastify;
      const { query, variables } = req.body;

      return graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: { prisma },
      });
    },
  });
};

export default plugin;
