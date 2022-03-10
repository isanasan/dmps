import { assertEquals } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { uniq } from "../src/uniq.ts";
Deno.test("uniq test", () => {
  assertEquals(
    ["hoge", "huga"],
    uniq(["hoge", "huga", "hoge", "huga", "hoge"]),
  );
});
