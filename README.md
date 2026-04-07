# x-analytics-cli

X Analytics CLI & Skills for AI agents (and humans). Search recent tweets, count tweet volumes by time, pull user profiles and timelines, and more.

**Works with:** OpenClaw, Claude Code, Cursor, Codex, and any agent that can run shell commands.

## Installation

Tell your AI agent (e.g. OpenClaw):

> Install this CLI and skills from https://github.com/Bin-Huang/x-analytics-cli

Or install manually:

```bash
npm install -g x-analytics-cli

# Add skills for AI agents (Claude Code, Cursor, Codex, etc.)
npx skills add Bin-Huang/x-analytics-cli
```

Or run directly: `npx x-analytics-cli --help`

## How it works

Built on the official [X API v2](https://docs.x.com/x-api). Handles OAuth 1.0a signing natively with Node.js `crypto` (no external dependencies). Every command outputs structured JSON to stdout, ready for agents to parse without extra processing.

Core endpoints covered:

- **[Tweet Lookup](https://docs.x.com/x-api/posts/lookup)** -- get tweets by ID
- **[User Lookup](https://docs.x.com/x-api/users/lookup)** -- get users by ID or username
- **[Search](https://docs.x.com/x-api/posts/search)** -- search recent tweets
- **[Tweet Counts](https://docs.x.com/x-api/posts/counts)** -- count tweets matching a query
- **[Timelines](https://docs.x.com/x-api/posts/timelines)** -- get a user's tweet timeline

## Setup

### Step 1: Get X API access

1. Go to the [X Developer Portal](https://developer.x.com/) and sign in.
2. Create a project and app if you don't have one.
3. Make sure your app has at least Basic access (Free tier only supports `GET /2/users/me`; Basic or higher is required for tweet lookup, user lookup, search, counts, and timelines).

### Step 2: Get your API credentials

In the Developer Portal, under your app's "Keys and Tokens" page, obtain:

- **API Key** (also called Consumer Key)
- **API Secret** (also called Consumer Secret)
- **Access Token**
- **Access Token Secret**

### Step 3: Place the credentials file

Choose one of these options:

```bash
# Option A: Default path (recommended)
mkdir -p ~/.config/x-analytics-cli
cat > ~/.config/x-analytics-cli/credentials.json << EOF
{
  "api_key": "YOUR_API_KEY",
  "api_secret": "YOUR_API_SECRET",
  "access_token": "YOUR_ACCESS_TOKEN",
  "access_token_secret": "YOUR_ACCESS_TOKEN_SECRET"
}
EOF

# Option B: Environment variables
export X_API_KEY=your_api_key
export X_API_SECRET=your_api_secret
export X_ACCESS_TOKEN=your_access_token
export X_ACCESS_TOKEN_SECRET=your_access_token_secret

# Option C: Pass per command
x-analytics-cli --credentials /path/to/credentials.json me
```

Credentials are resolved in this order:
1. `--credentials <path>` flag
2. `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET` env vars
3. `~/.config/x-analytics-cli/credentials.json` (auto-detected)

## Usage

All commands output pretty-printed JSON by default. Use `--format compact` for compact single-line JSON.

### me

Get the authenticated user's profile.

```bash
x-analytics-cli me
x-analytics-cli me --user-fields public_metrics,description,created_at
```

### user

Get a user by username or numeric ID.

```bash
x-analytics-cli user elonmusk
x-analytics-cli user 44196397
x-analytics-cli user elonmusk --user-fields public_metrics,description
```

### tweet

Get a single tweet by ID.

```bash
x-analytics-cli tweet 1234567890
x-analytics-cli tweet 1234567890 --tweet-fields public_metrics,created_at
```

### tweets

Get multiple tweets by IDs (comma-separated).

```bash
x-analytics-cli tweets 1234567890,9876543210
x-analytics-cli tweets 1234567890,9876543210 --tweet-fields public_metrics --expansions author_id --user-fields username
```

### search

Search recent tweets (last 7 days).

```bash
x-analytics-cli search "from:elonmusk"
x-analytics-cli search "OpenAI" --max-results 50 --sort-order relevancy
x-analytics-cli search "#AI" --start-time 2026-03-10T00:00:00Z --end-time 2026-03-17T00:00:00Z
```

Options:
- `--max-results <n>` -- 10-100 (default 10)
- `--start-time <time>` -- ISO 8601 start time
- `--end-time <time>` -- ISO 8601 end time
- `--sort-order <order>` -- `recency` or `relevancy`
- `--next-token <token>` -- pagination token
- `--tweet-fields`, `--user-fields`, `--media-fields`, `--expansions` -- field selection

### tweet-counts

Get tweet counts for a search query (last 7 days).

```bash
x-analytics-cli tweet-counts "OpenAI"
x-analytics-cli tweet-counts "#AI" --granularity hour
x-analytics-cli tweet-counts "from:elonmusk" --granularity day --start-time 2026-03-01T00:00:00Z
```

Options:
- `--granularity <g>` -- `minute`, `hour`, or `day` (default `day`)
- `--start-time <time>` -- ISO 8601 start time
- `--end-time <time>` -- ISO 8601 end time
- `--next-token <token>` -- pagination token

### timeline

Get tweets posted by the authenticated user.

```bash
x-analytics-cli timeline
x-analytics-cli timeline --max-results 50 --exclude retweets,replies
x-analytics-cli timeline --tweet-fields public_metrics,created_at --start-time 2026-03-01T00:00:00Z
```

Options:
- `--max-results <n>` -- 1-100
- `--start-time <time>` -- ISO 8601 start time
- `--end-time <time>` -- ISO 8601 end time
- `--exclude <types>` -- `retweets`, `replies` (comma-separated)
- `--next-token <token>` -- pagination token
- `--tweet-fields`, `--user-fields`, `--media-fields`, `--expansions` -- field selection

## Error output

Errors are written to stderr as JSON with an `error` field and a non-zero exit code:

```json
{"error": "Unauthorized - Invalid or expired token"}
```

## API Reference

- Official docs: https://docs.x.com/x-api

## Related

- [google-analytics-cli](https://github.com/Bin-Huang/google-analytics-cli) -- Google Analytics CLI & Skills for AI agents (and humans)
- [google-search-console-cli](https://github.com/Bin-Huang/google-search-console-cli) -- Google Search Console CLI & Skills for AI agents (and humans)
- [youtube-analytics-cli](https://github.com/Bin-Huang/youtube-analytics-cli) -- YouTube Analytics CLI & Skills for AI agents (and humans)
- [camoufox-cli](https://github.com/Bin-Huang/camoufox-cli) -- Anti-detect browser CLI & Skills for AI agents
- [google-ads-open-cli](https://github.com/Bin-Huang/google-ads-open-cli) -- Google Ads CLI & Skills for AI agents (and humans)
- [meta-ads-open-cli](https://github.com/Bin-Huang/meta-ads-open-cli) -- Meta Ads CLI & Skills for AI agents (and humans)
- [microsoft-ads-cli](https://github.com/Bin-Huang/microsoft-ads-cli) -- Microsoft Ads CLI & Skills for AI agents (and humans)
- [amazon-ads-open-cli](https://github.com/Bin-Huang/amazon-ads-open-cli) -- Amazon Ads CLI & Skills for AI agents (and humans)
- [tiktok-ads-cli](https://github.com/Bin-Huang/tiktok-ads-cli) -- TikTok Ads CLI & Skills for AI agents (and humans)
- [linkedin-ads-cli](https://github.com/Bin-Huang/linkedin-ads-cli) -- LinkedIn Ads CLI & Skills for AI agents (and humans)
- [x-ads-cli](https://github.com/Bin-Huang/x-ads-cli) -- X Ads CLI & Skills for AI agents (and humans)
- [snapchat-ads-cli](https://github.com/Bin-Huang/snapchat-ads-cli) -- Snapchat Ads CLI & Skills for AI agents (and humans)
- [pinterest-ads-cli](https://github.com/Bin-Huang/pinterest-ads-cli) -- Pinterest Ads CLI & Skills for AI agents (and humans)
- [reddit-ads-cli](https://github.com/Bin-Huang/reddit-ads-cli) -- Reddit Ads CLI & Skills for AI agents (and humans)
- [spotify-ads-cli](https://github.com/Bin-Huang/spotify-ads-cli) -- Spotify Ads CLI & Skills for AI agents (and humans)
- [apple-ads-cli](https://github.com/Bin-Huang/apple-ads-cli) -- Apple Ads CLI & Skills for AI agents (and humans)
## License

Apache-2.0
