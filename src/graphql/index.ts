import { ApolloServer } from "@apollo/server";
import { prismaClient } from "../lib/db";
import { User } from "./user";

async function createApolloGraphqlServer() {
  const gqlServer = new ApolloServer({
    typeDefs: `
            ${User.typeDefs}
            type Query {
              ${User.queries}
            }
    
            type Mutation{
             ${User.mutations}
            }
        `, //Schema
    resolvers: {
      Query: {
        ...User.resolvers.queries,
      },
      Mutation: {
        ...User.resolvers.mutations,
      },
    },
  });

  //Start the gqlServer
  await gqlServer.start();

  return gqlServer;
}

export { createApolloGraphqlServer };
