import { makeSchema } from "nexus";
import * as path from "path";
import { isProduction } from "../../constants";
import mutations from "./mutations";
import * as types from "./types";

const schema = makeSchema({
  types: [types, ...mutations],
  contextType: {
    module: path.join(process.cwd(), "./src/graphql/server/index.ts"),
    export: "Context",
  },
  shouldGenerateArtifacts: !isProduction,
  outputs: {
    schema: path.join(process.cwd(), "generated/schema.gen.graphql"),
  },
});

export default schema;
