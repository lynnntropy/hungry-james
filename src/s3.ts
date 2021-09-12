import { S3 } from "@aws-sdk/client-s3";
import config from "./config";

const s3 = new S3({
  endpoint: config.aws.s3.endpoint,
  region: config.aws.region,
  credentials: config.aws.credentials,
  forcePathStyle: config.aws.s3.forcePathStyle,
});

export default s3;
