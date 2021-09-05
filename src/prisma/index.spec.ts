import { PrismaClient } from "@prisma/client";
import prisma from ".";

test("returns a client", () => {
  expect(prisma).toBeInstanceOf(PrismaClient);
});
