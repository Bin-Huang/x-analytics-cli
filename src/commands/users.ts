import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerUserCommands(program: Command): void {
  program
    .command("user <username-or-id>")
    .description("Get a user by username or numeric ID")
    .option("--user-fields <fields>", "User fields to include")
    .option("--expansions <expansions>", "Expansions to include")
    .option("--tweet-fields <fields>", "Tweet fields to include")
    .action(async (usernameOrId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {};
        if (opts.userFields) params["user.fields"] = opts.userFields;
        if (opts.expansions) params.expansions = opts.expansions;
        if (opts.tweetFields) params["tweet.fields"] = opts.tweetFields;

        // Strip leading @ if present
        const cleaned = usernameOrId.replace(/^@/, "");
        // Numeric IDs use /users/:id, otherwise /users/by/username/:username
        const isNumericId = /^\d+$/.test(cleaned);
        const endpoint = isNumericId
          ? `/users/${cleaned}`
          : `/users/by/username/${cleaned}`;

        const data = await callApi(endpoint, { creds, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("me")
    .description("Get the authenticated user")
    .option("--user-fields <fields>", "User fields to include")
    .option("--expansions <expansions>", "Expansions to include")
    .option("--tweet-fields <fields>", "Tweet fields to include")
    .action(async (opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {};
        if (opts.userFields) params["user.fields"] = opts.userFields;
        if (opts.expansions) params.expansions = opts.expansions;
        if (opts.tweetFields) params["tweet.fields"] = opts.tweetFields;
        const data = await callApi("/users/me", { creds, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
