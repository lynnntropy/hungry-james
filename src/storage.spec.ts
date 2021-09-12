import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import config, { Config } from "./config";
import s3 from "./s3";
import { getNewAvatarKey, getSignedFileUploadUrl } from "./storage";
import * as presigner from "@aws-sdk/s3-request-presigner";

// jest.mock("./s3");
// jest.mock("@aws-sdk/s3-request-presigner");
jest.mock("./config");

// const s3Mock = s3 as jest.Mocked<S3>;
// const getSignedUrlMock = presigner.getSignedUrl as jest.Mock;
const configMock = config as jest.Mocked<Config>;

test("generates signed file upload URL", async () => {
  configMock.aws.s3.endpointPublic = "http://s3.test";

  const url = await getSignedFileUploadUrl("test_bucket", "test_key");

  expect(url.startsWith("http://s3.test/test_bucket/test_key?")).toStrictEqual(
    true
  );
});

test("generates random avatar key", async () => {
  const key = await getNewAvatarKey("1");
  expect(key).toMatch(/^1\/\S+$/);
});
