const functions = require("firebase-functions");
const appExport = require("./src/index");

process.env.X_GOOGLE_NEW_FUNCTION_SIGNATURE = true;

exports.api = functions.https.onRequest(appExport);
