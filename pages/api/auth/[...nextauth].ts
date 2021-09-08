import axios from "axios";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { User } from "../../../src/types/app";
import {
  fetchOrCreateUserForDiscordProfile,
  findUserById,
} from "../../../src/users";

export interface Guild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: string[];
}

type GuildsResponse = Guild[];

export default NextAuth({
  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      scope: "identify email guilds",
      async profile(profile, tokens) {
        return await fetchOrCreateUserForDiscordProfile(profile, tokens);
      },
    }),
  ],
  callbacks: {
    async session(session, token) {
      const user = (await findUserById(token.sub as string)) as User;

      return Promise.resolve({
        ...session,
        user,
      });
    },
    // async jwt(token, user) {
    //   if (user?.guilds) {
    //     token.guildIds = user.guilds.map((g: Guild) => g.id);
    //   }
    //   return token;
    // },
  },
});
