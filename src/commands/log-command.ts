import { fetchAllMergedPullRequests } from "../github.ts";
import { stringify as csvStringify } from "https://deno.land/std@0.129.0/encoding/csv.ts";

interface LogCommandOptions {
  start: string;
  end: string;
  query: string;
  format: string;
}
export async function logCommand(options: LogCommandOptions): Promise<void> {
  const prs = await fetchAllMergedPullRequests(
    options.query,
    options.start,
    options.end,
  );

  if (options.format === "json") {
    console.log(JSON.stringify(prs, undefined, 2));
  } else if (options.format === "csv") {
    console.log(
      await csvStringify(
        prs.map((pr) => {
          return {
            leadTimeSeconds: pr.leadTimeSeconds,
            timeToMergeSeconds: pr.timeToMergeSeconds,
            timeToMergeFromFirstReviewSeconds:
              pr.timeToMergeFromFirstReviewSeconds,
            title: pr.title,
            author: pr.author,
            url: pr.url,
            createdAt: pr.createdAt,
            mergedAt: pr.mergedAt,
            additions: pr.additions,
            deletions: pr.deletions,
            authoredDate: pr.authoredDate,
            firstReviewedAt: pr.firstReviewedAt,
          };
        }),
        [
          "leadTimeSeconds",
          "timeToMergeSeconds",
          "timeToMergeFromFirstReviewSeconds",
          "author",
          "url",
          "createdAt",
          "mergedAt",
          "additions",
          "deletions",
          "authoredDate",
          "firstReviewedAt",
        ],
      ),
    );
  } else {
    console.error("--format can be csv or json only");
    Deno.exit(1);
  }
}
