import { PullRequest } from "./entity.ts";
import { fetchAllMergedPullRequests } from "./github.ts";
import { createStat } from "./create-stat.ts";

interface StatCommandOptions {
  input: string | undefined;
  start: string | undefined;
  end: string | undefined;
  query: string | undefined;
}
export async function statCommand(options: StatCommandOptions): Promise<void> {
  let prs: PullRequest[] = [];

  if (options.query) {
    prs = await fetchAllMergedPullRequests(
      options.query,
      options.start,
      options.end,
    );
  } else if (options.input) {
    prs = createPullRequestsByLog(options.input);
  } else {
    console.error("You must specify either --query or --input");
    Deno.exit(1);
  }

  console.log(JSON.stringify(createStat(prs), undefined, 2));
}

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
