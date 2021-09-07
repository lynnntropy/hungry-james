import { Profile, TokenSet } from "next-auth";
import prisma from "./prisma";
import { fetchOrCreateUserForDiscordProfile } from "./users";

test("creates new user for new Discord ID", async () => {
  const userDelegate = {
    findFirst: jest.fn().mockReturnValue(undefined),
    create: jest.fn().mockReturnValue({
      id: 1,
      externalIds: {
        discord: "test_new_discord_id",
      },
      pronoun: "they/them/their/theirs/themselves",
      avatar:
        "https://cdn.discordapp.com/avatars/test_new_discord_id/test_avatar.png",
      avatarDead: null,
    }),
  };

  Object.defineProperty(prisma, "user", {
    value: userDelegate,
  });

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
  expect(userDelegate.create.mock.calls.length).toBe(1);
  expect(userDelegate.create.mock.calls[0].length).toBe(1);
  expect(userDelegate.create.mock.calls[0][0]).toEqual({
    data: {
      externalIds: {
        discord: "test_new_discord_id",
      },
      pronoun: "they/them/their/theirs/themselves",
      avatar:
        "https://cdn.discordapp.com/avatars/test_new_discord_id/test_avatar.png",
      avatarDead: null,
    },
  });

  expect(user).toStrictEqual({
    id: "1",
    externalIds: {
      discord: "test_new_discord_id",
    },
    pronoun: "they/them/their/theirs/themselves",
    avatar:
      "https://cdn.discordapp.com/avatars/test_new_discord_id/test_avatar.png",
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
