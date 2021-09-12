import { getNewAvatarKey, getSignedFileUploadUrl } from "./storage";

test("generates signed file upload URL", async () => {
  const url = await getSignedFileUploadUrl("test_bucket", "test_key");

  expect(
    url.startsWith("http://s3-public.test/test_bucket/test_key?")
  ).toStrictEqual(true);
});

test("generates random avatar key", async () => {
  const key = await getNewAvatarKey("1");
  expect(key).toMatch(/^1\/\S+$/);
});
