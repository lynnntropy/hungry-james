import { User as NextAuthUser } from "next-auth";

export interface User extends NextAuthUser {
  id: string;
  externalIds: {
    discord?: string;
  } | null;
  pronoun: string;
  avatar: string;
  avatarDead: string | null;
}
