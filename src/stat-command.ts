import { PullRequest } from "./entity.ts";

export function createPullRequestsByLog(path: string): PullRequest[] {
  const logs = JSON.parse(Deno.readTextFileSync(path));
  return logs.map(
    (p: any) =>
      new PullRequest(
        p.title,
        p.author,
        p.url,
        p.createdAt,
        p.mergedAt,
        p.additions,
        p.deletions,
        p.authoredDate,
        p.firstReviewedAt,
      ),
  );
}
