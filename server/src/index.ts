import "reflect-metadata";
import express, { response } from "express";
import { createConnection, Connection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./graphqlSchema/resolvers";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import dotEnv from "dotenv";
// import { Users } from "./entity/Users";

(async () => {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(
    cors({
      origin: "https://studio.apollographql.com",
      credentials: true,
    })
  );

  // configure app to use bodyParser()
  // this will let us get the data from a POST
  // exclusing the route to graphql
  app.use(/\/((?!graphql).)*/, bodyParser.urlencoded({ extended: true }));
  app.use(/\/((?!graphql).)*/, bodyParser.json());

  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Origin",
      "https://studio.apollographql.com"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE, PATCH, HEAD,OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin,Content-Type, Authorization"
    );
    next();
  });
  dotEnv.config();

  createConnection()
    .then((connection) => {
      // here you can start to work with your entities
    })
    .catch((error) => console.log(error));

  const server = new ApolloServer({
    schema: schema,
    context: ({ req, res }) => ({ req, res }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("Server running on port 4000");
  });
})();

// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));
