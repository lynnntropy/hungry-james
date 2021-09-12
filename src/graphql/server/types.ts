import { objectType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.id("id");
    t.nonNull.string("pronoun");
    t.string("avatar");
    t.string("avatarDead");
  },
});