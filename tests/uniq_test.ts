import { assertEquals } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { uniq } from "../src/uniq.ts";
Deno.test("can make stat by simple-log", () => {
  assertEquals("hoge", uniq("hoge"));
});
