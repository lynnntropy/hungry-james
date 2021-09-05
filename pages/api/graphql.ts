import { NextApiRequest, NextApiResponse } from "next";
import server from "../../src/graphql/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

const startServer = server.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await startServer;
  await server.createHandler({
    path: "/api/graphql",
  })(req, res);
}
