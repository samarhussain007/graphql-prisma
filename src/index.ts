import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8080;

  app.use(express.json());

  //Create Graphql Server

  const gqlServer = new ApolloServer({
    typeDefs: `

      type User{
        id:ID
        firstName:String
        lastName:String
        password:String
        email:String
        salt:String
      }
        type Query {
            hello: String
            say(name:String):String
            getUsers:[User]
        }

        type Mutation{
          createUser(firstName: String!, lastName: String!, email:String!, password: String!):Boolean
        }
    `, //Schema
    resolvers: {
      Query: {
        hello: () => `Hey ther,Iam a gql server`,
        say: (_, { name }: { name: string }) => `Hey ${name} how are you?`,
        getUsers: async () => {
          const allUsers = await prismaClient.user.findMany();
          return allUsers;
        },
      },
      Mutation: {
        createUser: async (
          _,
          {
            firstName,
            lastName,
            email,
            password,
          }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
          }
        ) => {
          await prismaClient.user.create({
            data: {
              email,
              firstName,
              lastName,
              password,
              salt: "random_salt",
            },
          });
          return true;
        },
      },
    },
  });

  //Start the gqlServer

  await gqlServer.start();

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(PORT, () => {
    console.log(`Server is listening in ${PORT}`);
  });
}
init();
