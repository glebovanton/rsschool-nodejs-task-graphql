import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import depthLimit from 'graphql-depth-limit';
import { graphql, GraphQLSchema, GraphQLObjectType, parse, validate } from 'graphql';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
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
      const depthLimitation = 5;

      try {
        const validationErrors = validate(schema, parse(query), [depthLimit(depthLimitation)]);;
        if (validationErrors?.length > 0) {
          console.log(`Maximum depth exceeded: ${depthLimitation}`);

          return {  data: null, errors: validationErrors };
        }

        return graphql({
          schema,
          source: query,
          variableValues: variables,
          contextValue: { prisma },
        });
      } catch (error) {
        console.error('GraphQL Error:', error);
        throw new Error('An error occurred while processing the GraphQL request');
      }
    },
  });
};

export default plugin;
