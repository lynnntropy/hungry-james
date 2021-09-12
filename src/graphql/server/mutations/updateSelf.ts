import { arg, inputObjectType, mutationField, nonNull } from "nexus";
import { User } from "../types";

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

export default updateSelf;
