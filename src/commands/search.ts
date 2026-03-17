import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerSearchCommands(program: Command): void {
  program
    .command("search <query>")
    .description("Search recent tweets (last 7 days)")
    .option("--max-results <n>", "Max results (10-100)")
    .option("--start-time <time>", "Start time (ISO 8601)")
    .option("--end-time <time>", "End time (ISO 8601)")
    .option("--sort-order <order>", "Sort order: recency or relevancy")
    .option("--next-token <token>", "Pagination token")
    .option("--tweet-fields <fields>", "Tweet fields to include")
    .option("--expansions <expansions>", "Expansions to include")
    .option("--user-fields <fields>", "User fields to include")
    .option("--media-fields <fields>", "Media fields to include")
    .option("--place-fields <fields>", "Place fields to include")
    .option("--poll-fields <fields>", "Poll fields to include")
    .action(async (query: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { query };
        if (opts.maxResults) params.max_results = opts.maxResults;
        if (opts.startTime) params.start_time = opts.startTime;
        if (opts.endTime) params.end_time = opts.endTime;
        if (opts.sortOrder) params.sort_order = opts.sortOrder;
        if (opts.nextToken) params.next_token = opts.nextToken;
        if (opts.tweetFields) params["tweet.fields"] = opts.tweetFields;
        if (opts.expansions) params.expansions = opts.expansions;
        if (opts.userFields) params["user.fields"] = opts.userFields;
        if (opts.mediaFields) params["media.fields"] = opts.mediaFields;
        if (opts.placeFields) params["place.fields"] = opts.placeFields;
        if (opts.pollFields) params["poll.fields"] = opts.pollFields;
        const data = await callApi("/tweets/search/recent", { creds, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("tweet-counts <query>")
    .description("Get tweet counts for a search query (last 7 days)")
    .option("--granularity <g>", "Granularity: minute, hour, or day", "day")
    .option("--start-time <time>", "Start time (ISO 8601)")
    .option("--end-time <time>", "End time (ISO 8601)")
    .option("--next-token <token>", "Pagination token")
    .action(async (query: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { query };
        if (opts.granularity) params.granularity = opts.granularity;
        if (opts.startTime) params.start_time = opts.startTime;
        if (opts.endTime) params.end_time = opts.endTime;
        if (opts.nextToken) params.next_token = opts.nextToken;
        const data = await callApi("/tweets/counts/recent", { creds, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
