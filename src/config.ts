import { Credentials as AwsCredentials } from "@aws-sdk/types";

interface Config {
  aws: {
    region: string;
    credentials: AwsCredentials;
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
      forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === "true",
      buckets: {
        avatars: process.env.AWS_S3_BUCKET_AVATARS ?? "avatars",
      },
    },
  },
};

export default config;
