import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid/async";
import config from "./config";
import s3 from "./s3";

export const getSignedFileUploadUrl = async (bucket: string, key: string) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const internalUrl = new URL(await getSignedUrl(s3, command));

  const url =
    config.aws.s3.endpointPublic + internalUrl.pathname + internalUrl.search;

  return url;
};

export const getNewAvatarKey = async (userId: string) => {
  return `${userId}/${await nanoid()}`;
};
