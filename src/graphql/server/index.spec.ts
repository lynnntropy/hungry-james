import { ApolloServer } from "apollo-server-micro";
import server from ".";

test("returns a server", () => {
  expect(server).toBeInstanceOf(ApolloServer);
});
