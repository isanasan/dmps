import { assertEquals } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { uniq } from "../src/uniq.ts";
Deno.test("simple", () => {
  assertEquals(
    ["hoge", "huga"],
    uniq(["hoge", "huga", "hoge"]),
  );
});

Deno.test("multi", () => {
  assertEquals(
    ["hoge", "huga"],
    uniq(["hoge", "huga", "hoge", "huga", "hoge"]),
  );
});

Deno.test("dubble", () => {
  assertEquals(
    ["hoge", "huga"],
    uniq(["hoge", "hoge", "huga", "huga"]),
  );
});
