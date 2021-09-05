import { makeSchema, mutationType, objectType, queryType } from "nexus";

const User = objectType({
  name: "User",
  definition(t) {
    t.id("id");
    t.string("pronoun");
    t.string("avatar");
    t.string("avatarDead");
  },
});

// const Query = queryType({ definition(t) {} });

// const Mutation = mutationType({ definition(t) {} });

const schema = makeSchema({ types: [User] });

export default schema;
