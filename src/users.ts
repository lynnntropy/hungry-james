import { Profile, TokenSet } from "next-auth";
import prisma from "./prisma";
import { defaultPronoun, serializePronoun } from "./pronouns";
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

const createUserForDiscordProfile = async (
  profile: Profile,
  tokens: TokenSet
): Promise<User> => {
  let imageUrl: string;

  if (profile.avatar === null) {
    const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
    imageUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
  } else {
    const format = profile.avatar.startsWith("a_") ? "gif" : "png";
    imageUrl = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
  }

  // TODO fetch guilds?

  const user = await prisma.user.create({
    data: {
      externalIds: {
        discord: profile.id,
      },
      pronoun: serializePronoun(defaultPronoun),
      avatar: imageUrl, // TODO reupload Discord avatar to object storage?
      avatarDead: null,
    },
  });

  return { ...user, id: user.id.toString() } as User;
};
