import { assert, expect, test } from "vitest";
import { removeUrlProtocol } from "../../../src/lib/utils/index.ts";

test("removeUrlProtocol()", () => {
  expect(removeUrlProtocol("https://example.com")).toBe("example.com");
});
