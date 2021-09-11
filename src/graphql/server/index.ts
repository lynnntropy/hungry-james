import { ApolloServer, AuthenticationError } from "apollo-server-micro";
import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import { isProduction } from "../../constants";
import schema from "./schema";

export interface Context {
  session: Session;
}

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const session = await getSession({ req });

    if (isProduction && session === null) {
      throw new AuthenticationError(
        "You must be logged in to access the GraphQL API."
      );
    }

    return { session };
  },
});

export default server;
