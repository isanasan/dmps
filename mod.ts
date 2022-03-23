import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";
import { logCommand } from "./src/commands/log-command.ts";
import { statCommand } from "./src/commands/stat-command.ts";
import { intervalCommand } from "./src/commands/interval-command.ts";

async function main(): Promise<void> {
  const log = new Command()
    .option("--start <date>", "start date", { required: true })
    .option("--end <date>", "end date", { required: true })
    .option("--query <string>", "query for github search", { required: true })
    .option(
      "--format <format>",
      "output format.  The available is json or csv",
      { default: "json" },
    )
    .action(logCommand);

  const stat = new Command()
    .option("--input <filepath>", "the input file path")
    .option("--start <date>", "start date", { required: true })
    .option("--end <date>", "end date", { required: true })
    .option("--query <string>", "query for github search", { required: true })
    .action(statCommand);

  const interval = new Command()
    .option("--start <date>", "start date", { required: true })
    .option("--end <date>", "end date", { required: true })
    .option("--interval-days <date>", "interval date", { required: true })
    .option("--query <string>", "query for github search", { required: true })
    .action(intervalCommand);

  await new Command()
    .version("0.1.0")
    .option("--input <filepath>", "the input file path")
    .option("--start <date>", "start date", { required: true })
    .option("--end <date>", "end date", { required: true })
    .option("--query <string>", "query for github search", { required: true })
    .action(statCommand)
    .command("log", log)
    .command("stat", stat)
    .command("interval", interval)
    .parse(Deno.args);
}

main().catch((error) => console.error(error));
