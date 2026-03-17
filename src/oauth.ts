import { createHmac, randomBytes } from "crypto";
import type { XCredentials } from "./auth.js";

function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function generateNonce(): string {
  return randomBytes(16).toString("hex");
}

function generateTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

export function buildAuthHeader(
  method: string,
  url: string,
  params: Record<string, string>,
  creds: XCredentials
): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: creds.api_key,
    oauth_nonce: generateNonce(),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: generateTimestamp(),
    oauth_token: creds.access_token,
    oauth_version: "1.0",
  };

  // Combine all params for signature base string
  const allParams: Record<string, string> = { ...params, ...oauthParams };
  const sortedKeys = Object.keys(allParams).sort();
  const paramString = sortedKeys
    .map((k) => `${percentEncode(k)}=${percentEncode(allParams[k])}`)
    .join("&");

  const baseString = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(paramString),
  ].join("&");

  const signingKey = `${percentEncode(creds.api_secret)}&${percentEncode(creds.access_token_secret)}`;
  const signature = createHmac("sha1", signingKey)
    .update(baseString)
    .digest("base64");

  oauthParams.oauth_signature = signature;

  const headerParts = Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
    .join(", ");

  return `OAuth ${headerParts}`;
}
