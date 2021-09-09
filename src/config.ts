import { Credentials } from "@aws-sdk/types";
import { isProduction } from "./constants";

interface Config {
  aws: {
    region: string;
    credentials: Credentials;
    s3: {
      endpoint?: string;
      forcePathStyle: boolean;
      buckets: {
        [key: string]: string;
      };
    };
  };
}

const config: Config = {
  aws: {
    region: process.env.AWS_REGION ?? "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    s3: {
      endpoint: process.env.AWS_S3_ENDPOINT,
      forcePathStyle: isProduction ? false : true,
      buckets: {
        avatars: isProduction ? "TODO_production_avatars_bucket" : "avatars",
      },
    },
  },
};

export default config;
