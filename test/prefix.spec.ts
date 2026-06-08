import * as assert from "node:assert";
import { describe, it } from "node:test";
import { removeWhiteSpace } from "./util/index.ts";
import JsonToTS from "../src/index.ts";

describe("Prefix", function () {
  it("should write out prefix with multiple different objects [object1, object2]", function () {
    const json = [{ foo: "foo" }, { bar: "bar" }];

    const expectedTypes = [
      `interface PrefixRootObject {
        foo?: string;
        bar?: string;
      }`,
    ].map(removeWhiteSpace);

    const interfaces = JsonToTS(json, { prefix: "Prefix" });

    interfaces.forEach((i) => {
      const noWhiteSpaceInterface = removeWhiteSpace(i);
      assert.ok(expectedTypes.includes(noWhiteSpaceInterface));
    });
    assert.equal(interfaces.length, 1);
  });
});
