import express from "express";

import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";
import { createApolloGraphqlServer } from "./graphql";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8080;

  app.use(express.json());

  //Create Graphql Server

  const GQserver = await createApolloGraphqlServer();

  app.use("/graphql", expressMiddleware(GQserver));
  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });
  app.listen(PORT, () => {
    console.log(`Server is listening in ${PORT}`);
  });
}
init();
