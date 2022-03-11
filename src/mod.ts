import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";
import { logCommand } from "./log-command.ts";
import { statCommand } from "./stat-command.ts";

async function main(): Promise<void> {
  const program = await new Command()
    .version("0.1.0");

  program
    .command("stat")
    .option("--input <filepath>", "the input file path")
    .option("--start <date>", "start date")
    .option("--end <date>", "end date")
    .option("--query <search query>", "search query")
    .action(statCommand);

  program
    .command("log")
    .option("--start <date>", "start date", { required: true })
    .option("--end <date>", "end date", { required: true })
    .option("--query <search query>", "query for github search")
    .option(
      "--format <format>",
      "output format.  The available is json or csv",
      { default: "json" },
    )
    .action(logCommand);

  program.parse(Deno.args);
}

main().catch((error) => console.error(error));
