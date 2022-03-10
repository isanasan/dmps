import { assertEquals } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.128.0/path/mod.ts";
import { createPullRequestsByLog, createStat } from "../src/stat-command.ts";

Deno.test("can make stat by simple-log", () => {
  const path = join(
    dirname(fromFileUrl(import.meta.url)),
    "../testdata/simple-log.json",
  );
  const prs = createPullRequestsByLog(path);
  const stat = createStat(prs);

  assertEquals(
    stat,
    {
      "additionsAverage": 260,
      "additionsMedian": 92.5,
      "authorCount": 3,
      "count": 4,
      "deletionsAverage": 70.75,
      "deletionsMedian": 23.5,
      "leadTimeSecondsAverage": 2911116,
      "leadTimeSecondsMedian": 658212,
      "timeToMergeFromFirstReviewSecondsAverage": 454493,
      "timeToMergeFromFirstReviewSecondsMedian": 454493,
      "timeToMergeSecondsAverage": 2591489,
      "timeToMergeSecondsMedian": 549684,
    },
  );
});

Deno.test("can make stat by repo-vscode", () => {
  const path = join(
    dirname(fromFileUrl(import.meta.url)),
    "../testdata/log-repo-vscode.json",
  );
  const prs = createPullRequestsByLog(path);
  const stat = createStat(prs);

  assertEquals(
    stat,
    {
      "additionsAverage": 56.074074074074076,
      "additionsMedian": 8,
      "authorCount": 16,
      "count": 27,
      "deletionsAverage": 24.11111111111111,
      "deletionsMedian": 3,
      "leadTimeSecondsAverage": 633907,
      "leadTimeSecondsMedian": 164856,
      "timeToMergeFromFirstReviewSecondsAverage": 206823,
      "timeToMergeFromFirstReviewSecondsMedian": 17640,
      "timeToMergeSecondsAverage": 541799,
      "timeToMergeSecondsMedian": 32512,
    },
  );
});
