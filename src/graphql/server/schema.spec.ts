import { GraphQLSchema } from "graphql";
import schema from "./schema";

test("returns a schema", () => {
  expect(schema).toBeInstanceOf(GraphQLSchema);
});
