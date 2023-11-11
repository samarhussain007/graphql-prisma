import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8080;

  app.use(express.json());

  //Create Graphql Server

  const gqlServer = new ApolloServer({
    typeDefs: `
        type Query {
            hello: String
            say(name:String):String
        }
    
    `, //Schema
    resolvers: {
      Query: {
        hello: () => `Hey ther,Iam a gql server`,
        say: (_, { name }: { name: string }) => `Hey ${name} how are you?`,
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
