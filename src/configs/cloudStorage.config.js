"use strict";

const env = process.env;

const { Storage } = require("@google-cloud/storage");
const gc = new Storage({
  credentials: {
    client_email: env.CLIENT_EMAIL,
    private_key: env.PRIVATE_KEY.replace(/\\n/gm, "\n"),
  },
  projectId: env.PROYECT_ID,
});
const defaultBucket = gc.bucket(env.GC_BUCKET);

module.exports = defaultBucket;
