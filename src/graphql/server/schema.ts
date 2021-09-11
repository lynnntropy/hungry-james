import {
  arg,
  inputObjectType,
  makeSchema,
  mutationField,
  nonNull,
  objectType,
} from "nexus";
import * as path from "path";
import { isProduction } from "../../constants";

const User = objectType({
  name: "User",
  definition(t) {
    t.id("id");
    t.nonNull.string("pronoun");
    t.string("avatar");
    t.string("avatarDead");
  },
});

// const Query = queryType({ definition(t) {} });

// const Mutation = mutationType({ definition(t) {} });

const UpdateSelfInput = inputObjectType({
  name: "UpdateSelfInput",
  definition(t) {
    t.string("pronoun");
    t.string("avatar");
    t.string("avatarDead");
  },
});

const updateSelf = mutationField("updateSelf", {
  type: User,
  args: {
    input: nonNull(
      arg({
        type: UpdateSelfInput,
      })
    ),
  },
  resolve(_, args, ctx) {
    const { session } = ctx;
    console.log(args);
    console.log(session);
  },
});

const schema = makeSchema({
  types: [User, updateSelf],
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
