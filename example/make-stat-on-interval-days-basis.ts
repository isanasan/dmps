import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";
import addDays from "https://deno.land/x/date_fns@v2.22.1/addDays/index.ts";
import add from "https://deno.land/x/date_fns@v2.22.1/add/index.ts";
import format from "https://deno.land/x/date_fns@v2.22.1/format/index.js";
import parseISO from "https://deno.land/x/date_fns@v2.22.1/parseISO/index.js";
import { stringify as csvStringify } from "https://deno.land/std@0.129.0/encoding/csv.ts";

async function main(): Promise<void> {
  const { options } = await new Command()
    .option("--start <date>", "start date", { required: true })
    .option("--end <date>", "end date", { required: true })
    .option("--interval-days <days>", "interval days", { required: true })
    .option("--query <query>", "query", { required: true })
    .parse(Deno.args);

  const startDate = parseISO(options.start, null);
  const endDate = parseISO(options.end, null);
  const query = options.query as string;
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

    const p = Deno.run({
      cmd: [
        "dmps",
        "--start",
        start.toISOString(),
        "--end",
        end.toISOString(),
        "--query",
        query,
      ],
      stdout: "piped",
    });

    const { code } = await p.status();

    if (code === 0) {
      const o = await p.output();
      const stdout = new TextDecoder().decode(o);
      const result = {
        startDate: format(start, "yyyy-MM-dd HH:mm:ss", null),
        endDate: format(end, "yyyy-MM-dd HH:mm:ss", null),
        ...JSON.parse(stdout),
      };
      allStats.push(result);
    } else {
      const rawError = await p.stderrOutput();
      const errorString = new TextDecoder().decode(rawError);
      console.log(errorString);
    }
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

main().catch((error) => console.error(error));
