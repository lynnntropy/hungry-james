import { arg, inputObjectType, mutationField, nonNull } from "nexus";
import { updateUser } from "../../../users";
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
  async resolve(_, { input }, { session: { user } }) {
    return updateUser(user.id, {
      pronoun: input.pronoun ?? undefined,
      avatar: input.avatar ?? undefined,
      avatarDead: input.avatarDead,
    });
  },
});

export default updateSelf;
