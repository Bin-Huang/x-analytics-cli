import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerTimelineCommands(program: Command): void {
  program
    .command("timeline")
    .description("Get tweets posted by the authenticated user")
    .option("--max-results <n>", "Max results (1-100)")
    .option("--start-time <time>", "Start time (ISO 8601)")
    .option("--end-time <time>", "End time (ISO 8601)")
    .option("--exclude <types>", "Exclude types: retweets, replies (comma-separated)")
    .option("--next-token <token>", "Pagination token")
    .option("--tweet-fields <fields>", "Tweet fields to include")
    .option("--expansions <expansions>", "Expansions to include")
    .option("--user-fields <fields>", "User fields to include")
    .option("--media-fields <fields>", "Media fields to include")
    .option("--place-fields <fields>", "Place fields to include")
    .option("--poll-fields <fields>", "Poll fields to include")
    .action(async (opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);

        // First get the authenticated user's ID
        const meResult = (await callApi("/users/me", { creds })) as {
          data?: { id: string };
        };
        if (!meResult.data?.id) {
          throw new Error("Failed to retrieve authenticated user ID");
        }
        const userId = meResult.data.id;

        const params: Record<string, string> = {};
        if (opts.maxResults) params.max_results = opts.maxResults;
        if (opts.startTime) params.start_time = opts.startTime;
        if (opts.endTime) params.end_time = opts.endTime;
        if (opts.exclude) params.exclude = opts.exclude;
        if (opts.nextToken) params.next_token = opts.nextToken;
        if (opts.tweetFields) params["tweet.fields"] = opts.tweetFields;
        if (opts.expansions) params.expansions = opts.expansions;
        if (opts.userFields) params["user.fields"] = opts.userFields;
        if (opts.mediaFields) params["media.fields"] = opts.mediaFields;
        if (opts.placeFields) params["place.fields"] = opts.placeFields;
        if (opts.pollFields) params["poll.fields"] = opts.pollFields;

        const data = await callApi(`/users/${userId}/tweets`, { creds, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
