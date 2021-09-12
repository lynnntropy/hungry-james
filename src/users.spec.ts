import { S3 } from "@aws-sdk/client-s3";
import axios, { AxiosStatic } from "axios";
import { Profile, TokenSet } from "next-auth";
import prisma from "./prisma";
import s3 from "./s3";
import { fetchOrCreateUserForDiscordProfile, updateUser } from "./users";

jest.mock("axios");
jest.mock("./s3");

const axiosMock = axios as jest.Mocked<AxiosStatic>;
const s3Mock = s3 as jest.Mocked<S3>;

test("creates new user for new Discord ID", async () => {
  const userDelegate = {
    findFirst: jest.fn().mockReturnValue(undefined),
    create: jest.fn().mockReturnValue({
      id: 1,
      externalIds: {
        discord: "test_new_discord_id",
      },
      pronoun: "they/them/their/theirs/themselves",
      avatar: "imported/discord/test_new_discord_id/test_avatar.png",
      avatarDead: null,
    }),
  };

  Object.defineProperty(prisma, "user", {
    value: userDelegate,
  });

  axiosMock.get.mockResolvedValueOnce({ data: "test_avatar_data" });

  const profile: Profile = {
    id: "test_new_discord_id",
    username: "username",
    email: "email@email.test",
    discriminator: "0001",
    avatar: "test_avatar",
  };

  const tokens: TokenSet = {
    accessToken: "test_access_token",
    access_token: "test_access_token",
    accessTokenExpires: null,
  };

  const user = await fetchOrCreateUserForDiscordProfile(profile, tokens);

  expect(userDelegate.findFirst.mock.calls.length).toBe(1);

  expect(axiosMock.get).toHaveBeenCalledTimes(1);
  expect(axiosMock.get.mock.calls[0][0]).toEqual(
    "https://cdn.discordapp.com/avatars/test_new_discord_id/test_avatar.png"
  );

  expect(s3Mock.putObject).toHaveBeenCalledTimes(1);
  expect(s3Mock.putObject).toHaveBeenCalledWith({
    Key: "imported/discord/test_new_discord_id/test_avatar.png",
    Bucket: "avatars",
    Body: "test_avatar_data",
  });

  expect(userDelegate.create).toHaveBeenCalledTimes(1);
  expect(userDelegate.create.mock.calls[0].length).toBe(1);
  expect(userDelegate.create.mock.calls[0][0]).toEqual({
    data: {
      externalIds: {
        discord: "test_new_discord_id",
      },
      pronoun: "they/them/their/theirs/themselves",
      avatar: "imported/discord/test_new_discord_id/test_avatar.png",
      avatarDead: null,
    },
  });

  expect(user).toStrictEqual({
    id: "1",
    externalIds: {
      discord: "test_new_discord_id",
    },
    pronoun: "they/them/their/theirs/themselves",
    avatar: "imported/discord/test_new_discord_id/test_avatar.png",
    avatarDead: null,
  });
});

test("returns user from database for known Discord ID", async () => {
  const userDelegate = {
    findFirst: jest.fn().mockReturnValue({
      id: 2,
      externalIds: {
        discord: "test_known_discord_id",
      },
      pronoun: "they/them/their/theirs/themselves",
      avatar:
        "https://cdn.discordapp.com/avatars/test_known_discord_id/test_avatar.png",
      avatarDead: null,
    }),
  };

  Object.defineProperty(prisma, "user", {
    value: userDelegate,
  });

  const profile: Profile = {
    id: "test_known_discord_id",
    username: "username",
    email: "email2@email.test",
    discriminator: "0002",
    avatar: "test_avatar",
  };

  const tokens: TokenSet = {
    accessToken: "test_access_token",
    access_token: "test_access_token",
    accessTokenExpires: null,
  };

  const user = await fetchOrCreateUserForDiscordProfile(profile, tokens);

  expect(userDelegate.findFirst.mock.calls.length).toBe(1);

  expect(user).toStrictEqual({
    id: "2",
    externalIds: {
      discord: "test_known_discord_id",
    },
    pronoun: "they/them/their/theirs/themselves",
    avatar:
      "https://cdn.discordapp.com/avatars/test_known_discord_id/test_avatar.png",
    avatarDead: null,
  });
});

test("updates user with all properties given", async () => {
  const userDelegate = {
    update: jest.fn().mockReturnValueOnce({
      id: 1,
      externalIds: {},
      pronoun: "test/test/test/test/test",
      avatar: "test_avatar",
      avatarDead: "test_avatar_dead",
    }),
  };

  Object.defineProperty(prisma, "user", {
    value: userDelegate,
  });

  const user = await updateUser("1", {
    pronoun: "test/test/test/test/test",
    avatar: "test_avatar",
    avatarDead: "test_avatar_dead",
  });

  expect(userDelegate.update).toHaveBeenCalledTimes(1);
  expect(userDelegate.update).toHaveBeenCalledWith({
    where: { id: 1 },
    data: {
      pronoun: "test/test/test/test/test",
      avatar: "test_avatar",
      avatarDead: "test_avatar_dead",
    },
  });

  expect(user).toStrictEqual({
    id: "1",
    externalIds: {},
    pronoun: "test/test/test/test/test",
    avatar: "test_avatar",
    avatarDead: "test_avatar_dead",
  });
});

test("updates user with some properties given", async () => {
  const userDelegate = {
    update: jest.fn().mockReturnValueOnce({
      id: 1,
      externalIds: {},
      pronoun: "test/test/test/test/test",
      avatar: "test_avatar",
      avatarDead: "test_avatar_dead",
    }),
  };

  Object.defineProperty(prisma, "user", {
    value: userDelegate,
  });

  const user = await updateUser("1", {
    pronoun: undefined,
    avatar: "test_avatar",
    avatarDead: "test_avatar_dead",
  });

  expect(userDelegate.update).toHaveBeenCalledTimes(1);
  expect(userDelegate.update).toHaveBeenCalledWith({
    where: { id: 1 },
    data: {
      avatar: "test_avatar",
      avatarDead: "test_avatar_dead",
    },
  });

  expect(user).toStrictEqual({
    id: "1",
    externalIds: {},
    pronoun: "test/test/test/test/test",
    avatar: "test_avatar",
    avatarDead: "test_avatar_dead",
  });
});
