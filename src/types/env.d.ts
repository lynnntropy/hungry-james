declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      DISCORD_CLIENT_ID: string;
      DISCORD_CLIENT_SECRET: string;
      NEXTAUTH_URL: string;
      DATABASE_URL: string;
      AWS_REGION?: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_S3_ENDPOINT?: string;
      AWS_S3_ENDPOINT_PUBLIC?: string;
      AWS_S3_FORCE_PATH_STYLE?: "true";
      AWS_S3_BUCKET_AVATARS?: string;
    }
  }
}

export {};
