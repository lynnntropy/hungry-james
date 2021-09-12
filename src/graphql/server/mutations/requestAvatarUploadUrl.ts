import { mutationField, objectType } from "nexus";
import config from "../../../config";
import { getNewAvatarKey, getSignedFileUploadUrl } from "../../../storage";

const AvatarUploadUrl = objectType({
  name: "AvatarUploadUrl",
  definition(t) {
    t.nonNull.string("key");
    t.nonNull.string("url");
  },
});

const requestAvatarUploadUrl = mutationField("requestAvatarUploadUrl", {
  type: AvatarUploadUrl,

  async resolve(_, __, { session: { user } }) {
    const key = await getNewAvatarKey(user.id);
    const url = await getSignedFileUploadUrl(
      config.aws.s3.buckets.avatars,
      key
    );

    return { key, url };
  },
});

export default requestAvatarUploadUrl;
