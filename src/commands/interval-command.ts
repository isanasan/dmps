import { fetchAllMergedPullRequests } from "../github.ts";
import { stringify as csvStringify } from "https://deno.land/std@0.129.0/encoding/csv.ts";
import addDays from "https://deno.land/x/date_fns@v2.22.1/addDays/index.ts";
import add from "https://deno.land/x/date_fns@v2.22.1/add/index.ts";
import format from "https://deno.land/x/date_fns@v2.22.1/format/index.js";
import parseISO from "https://deno.land/x/date_fns@v2.22.1/parseISO/index.js";
import { createStat } from "../create-stat.ts";

interface IntervalCommandOptions {
  start: string;
  end: string;
  intervalDays: string;
  query: string;
}

export async function intervalCommand(
  options: IntervalCommandOptions,
): Promise<void> {
  const startDate = parseISO(options.start, null);
  const endDate = parseISO(options.end, null);
  const intervalDays = parseInt(options.intervalDays);
  const allStats = [];

  for (
    let start = startDate;
    start < endDate;
    start = addDays(start, intervalDays)
  ) {
    const end = add(start, { days: intervalDays, seconds: -1 });
    console.error(format(start, "yyyy-MM-dd HH:mm:ss", null));
    console.error(format(end, "yyyy-MM-dd HH:mm:ss", null));

    const prs = await fetchAllMergedPullRequests(
      options.query,
      start.toISOString(),
      end.toISOString(),
    );

    const result = {
      startDate: format(start, "yyyy-MM-dd HH:mm:ss", null),
      endDate: format(end, "yyyy-MM-dd HH:mm:ss", null),
      ...JSON.parse(JSON.stringify(createStat(prs), undefined, 2)),
    };

    allStats.push(result);
  }

  console.log(
    await csvStringify(
      allStats.map((pr) => {
        return {
          startDate: pr.startDate,
          endDate: pr.endDate,
          count: pr.count,
          authorCount: pr.authorCount,
          additionsAverage: pr.additionsAverage,
          additionsMedian: pr.additionsMedian,
          deletionsAverage: pr.deletionsAverage,
          deletionsMedian: pr.deletionsMedian,
          leadTimeSecondsAverage: pr.leadTimeSecondsAverage,
          leadTimeSecondsMedian: pr.leadTimeSecondsMedian,
          timeToMergeSecondsAverage: pr.timeToMergeSecondsAverage,
          timeToMergeSecondsMedian: pr.timeToMergeSecondsMedian,
          timeToMergeFromFirstReviewSecondsAverage:
            pr.timeToMergeFromFirstReviewSecondsAverage,
          timeToMergeFromFirstReviewSecondsMedian:
            pr.timeToMergeFromFirstReviewSecondsMedian,
        };
      }),
      [
        "startDate",
        "endDate",
        "count",
        "authorCount",
        "additionsAverage",
        "additionsMedian",
        "deletionsAverage",
        "deletionsMedian",
        "leadTimeSecondsAverage",
        "leadTimeSecondsMedian",
        "timeToMergeSecondsAverage",
        "timeToMergeSecondsMedian",
        "timeToMergeFromFirstReviewSecondsAverage",
        "timeToMergeFromFirstReviewSecondsMedian",
      ],
    ),
  );
}
