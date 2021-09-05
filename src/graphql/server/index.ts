import { ApolloServer } from "apollo-server-micro";
import schema from "./schema";

const server = new ApolloServer({ schema });

export default server;
