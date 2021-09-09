import axios from "axios";
import { Profile, TokenSet } from "next-auth";
import config from "./config";
import prisma from "./prisma";
import { defaultPronoun, serializePronoun } from "./pronouns";
import s3 from "./s3";
import { User } from "./types/app";

export const fetchOrCreateUserForDiscordProfile = async (
  profile: Profile,
  tokens: TokenSet
): Promise<User> => {
  const user = await prisma.user.findFirst({
    where: { externalIds: { equals: { discord: profile.id } } },
  });

  if (user) {
    return { ...user, id: user.id.toString() } as User;
  }

  return await createUserForDiscordProfile(profile, tokens);
};

export const findUserById = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });

  if (user) {
    return { ...user, id: user.id.toString() } as User;
  }

  return null;
};

const createUserForDiscordProfile = async (
  profile: Profile,
  tokens: TokenSet
): Promise<User> => {
  let imageUrl: string;
  let avatarKey: string;

  if (profile.avatar === null) {
    const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
    imageUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
    avatarKey = `imported/discord/${profile.id}/${defaultAvatarNumber}.png`;
  } else {
    const format = profile.avatar.startsWith("a_") ? "gif" : "png";
    imageUrl = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
    avatarKey = `imported/discord/${profile.id}/${profile.avatar}.${format}`;
  }

  // TODO fetch guilds?

  const { data: avatarData } = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });

  await s3.putObject({
    Key: avatarKey,
    Bucket: config.aws.s3.buckets.avatars,
    Body: avatarData,
  });

  const user = await prisma.user.create({
    data: {
      externalIds: {
        discord: profile.id,
      },
      pronoun: serializePronoun(defaultPronoun),
      avatar: avatarKey,
      avatarDead: null,
    },
  });

  return { ...user, id: user.id.toString() } as User;
};
