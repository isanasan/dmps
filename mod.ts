import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";
import { logCommand } from "./src/commands/log-command.ts";
import { statCommand } from "./src/commands/stat-command.ts";

async function main(): Promise<void> {
  const log = new Command()
    .option("--start <date>", "start date", { required: true })
    .option("--end <date>", "end date", { required: true })
    .option("--query <string>", "query for github search")
    .option(
      "--format <format>",
      "output format.  The available is json or csv",
      { default: "json" },
    )
    .action(logCommand);

  const program = await new Command()
    .version("0.1.0");

  program
    .option("--input <filepath>", "the input file path")
    .option("--start <date>", "start date")
    .option("--end <date>", "end date")
    .option("--query <string>", "search query", { required: true })
    .action(statCommand)
    .command("log", log);

  program.parse(Deno.args);
}

main().catch((error) => console.error(error));
