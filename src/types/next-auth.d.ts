import { Guild } from "../../pages/api/auth/[...nextauth]";
import { User as AppUser } from "./app";

declare module "next-auth" {
  interface Session {
    user: AppUser;
  }

  interface User {
    [key: string]: any;
  }

  interface Profile {
    id: string;
    username: string;
    email: string;
    discriminator: string;
    avatar: string | null;
  }
}
