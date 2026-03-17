import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerTweetCommands(program: Command): void {
  program
    .command("tweets <ids>")
    .description("Get multiple tweets by IDs (comma-separated)")
    .option("--tweet-fields <fields>", "Tweet fields to include")
    .option("--expansions <expansions>", "Expansions to include")
    .option("--user-fields <fields>", "User fields to include")
    .option("--media-fields <fields>", "Media fields to include")
    .option("--place-fields <fields>", "Place fields to include")
    .option("--poll-fields <fields>", "Poll fields to include")
    .action(async (ids: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { ids };
        if (opts.tweetFields) params["tweet.fields"] = opts.tweetFields;
        if (opts.expansions) params.expansions = opts.expansions;
        if (opts.userFields) params["user.fields"] = opts.userFields;
        if (opts.mediaFields) params["media.fields"] = opts.mediaFields;
        if (opts.placeFields) params["place.fields"] = opts.placeFields;
        if (opts.pollFields) params["poll.fields"] = opts.pollFields;
        const data = await callApi("/tweets", { creds, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("tweet <id>")
    .description("Get a single tweet by ID")
    .option("--tweet-fields <fields>", "Tweet fields to include")
    .option("--expansions <expansions>", "Expansions to include")
    .option("--user-fields <fields>", "User fields to include")
    .option("--media-fields <fields>", "Media fields to include")
    .option("--place-fields <fields>", "Place fields to include")
    .option("--poll-fields <fields>", "Poll fields to include")
    .action(async (id: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {};
        if (opts.tweetFields) params["tweet.fields"] = opts.tweetFields;
        if (opts.expansions) params.expansions = opts.expansions;
        if (opts.userFields) params["user.fields"] = opts.userFields;
        if (opts.mediaFields) params["media.fields"] = opts.mediaFields;
        if (opts.placeFields) params["place.fields"] = opts.placeFields;
        if (opts.pollFields) params["poll.fields"] = opts.pollFields;
        const data = await callApi(`/tweets/${id}`, { creds, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
