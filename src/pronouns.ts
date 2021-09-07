import parse from "csv-parse/lib/sync";
import * as path from "path";
import { readFileSync } from "fs";

type Pronoun = string[];

const data = readFileSync(
  path.join(process.cwd(), "./submodules/pronoun.is/resources/pronouns.tab")
).toString("utf-8");

const pronouns: Pronoun[] = parse(data, {
  skipEmptyLines: true,
  delimiter: "\t",
});

export default pronouns;

export const serializePronoun = (pronoun: Pronoun): string => pronoun.join("/");
export const defaultPronoun = pronouns.find((p) => p[0] === "they") as Pronoun;
