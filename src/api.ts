import type { XCredentials } from "./auth.js";
import { buildAuthHeader } from "./oauth.js";

const BASE_URL = "https://api.x.com/2";

export interface ApiOptions {
  creds: XCredentials;
  params?: Record<string, string>;
}

export async function callApi(
  endpoint: string,
  opts: ApiOptions
): Promise<unknown> {
  const url = `${BASE_URL}${endpoint}`;
  const params = opts.params ?? {};

  // Build query string
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  }
  const qs = searchParams.toString();
  const fullUrl = qs ? `${url}?${qs}` : url;

  const authHeader = buildAuthHeader("GET", url, params, opts.creds);

  const res = await fetch(fullUrl, {
    method: "GET",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
  });

  const json = (await res.json()) as {
    data?: unknown;
    includes?: unknown;
    meta?: unknown;
    errors?: Array<{ message: string; detail?: string }>;
  };

  if (!res.ok || json.errors) {
    const msg =
      json.errors?.map((e) => e.detail ?? e.message).join("; ") ??
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  // Return the full v2 response shape (data + includes + meta)
  const result: Record<string, unknown> = {};
  if (json.data !== undefined) result.data = json.data;
  if (json.includes !== undefined) result.includes = json.includes;
  if (json.meta !== undefined) result.meta = json.meta;
  return Object.keys(result).length > 0 ? result : json;
}
