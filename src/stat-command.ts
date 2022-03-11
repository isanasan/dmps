import { PullRequest } from "./entity.ts";
import { median as _median } from "https://esm.sh/mathjs";
import { fetchAllMergedPullRequests } from "./github.ts";

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

interface PullRequestStat {
  count: number;
  authorCount: number;
  additionsAverage: number;
  additionsMedian: number;
  deletionsAverage: number;
  deletionsMedian: number;
  leadTimeSecondsAverage: number;
  leadTimeSecondsMedian: number;
  timeToMergeSecondsAverage: number;
  timeToMergeSecondsMedian: number;
  timeToMergeFromFirstReviewSecondsAverage: number;
  timeToMergeFromFirstReviewSecondsMedian: number;
}

export function createStat(prs: PullRequest[]): PullRequestStat {
  const leadTimes = prs.map((pr) => pr.leadTimeSeconds);
  const timeToMerges = prs.map((pr) => pr.timeToMergeSeconds);
  const timeToMergeFromFirstReviews = prs
    .map((pr) => pr.timeToMergeFromFirstReviewSeconds)
    .filter((x): x is number => x !== undefined);

  return {
    count: prs.length,
    authorCount: uniq(prs.map((pr) => pr.author)).length,
    additionsAverage: average(prs.map((pr) => pr.additions)),
    additionsMedian: median(prs.map((pr) => pr.additions)),
    deletionsAverage: average(prs.map((pr) => pr.deletions)),
    deletionsMedian: median(prs.map((pr) => pr.deletions)),
    leadTimeSecondsAverage: Math.floor(average(leadTimes)),
    leadTimeSecondsMedian: Math.floor(median(leadTimes)),
    timeToMergeSecondsAverage: Math.floor(average(timeToMerges)),
    timeToMergeSecondsMedian: Math.floor(median(timeToMerges)),
    timeToMergeFromFirstReviewSecondsAverage: Math.floor(
      average(timeToMergeFromFirstReviews),
    ),
    timeToMergeFromFirstReviewSecondsMedian: Math.floor(
      median(timeToMergeFromFirstReviews),
    ),
  };
}

function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((prev, current) => prev + current) / numbers.length;
}

function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return _median(numbers);
}

function uniq(targetArray: Array<string | null>): Array<unknown> {
  const filted = targetArray.filter((v) => v);

  let size = filted.length;
  for (let i = 0; i < size - 1; i++) {
    for (let j = i + 1; j < size; j++) {
      if (filted[i] === filted[j]) {
        filted.splice(j, 1);
        size--;
        j--;
      }
    }
  }
  return filted;
}
