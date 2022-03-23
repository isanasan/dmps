import { fetchAllMergedPullRequests } from "../github.ts";
import { stringify as csvStringify } from "https://deno.land/std@0.129.0/encoding/csv.ts";

interface IntervalCommandOptions {
  start: string;
  end: string;
  interval_days: string;
  query: string;
}

export async function intervalCommand(
  options: IntervalCommandOptions,
): Promise<void> {
  await console.log(options);
}
