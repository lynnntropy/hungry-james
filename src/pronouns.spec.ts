import pronouns from "./pronouns";

test("has at least one pronoun", () => {
  expect(pronouns.length).toBeGreaterThanOrEqual(1);
});

test("first pronoun is she/her", () => {
  expect(pronouns[0]).toStrictEqual(["she", "her", "her", "hers", "herself"]);
});
