import * as assert from "node:assert";
import { describe, it } from "node:test";
import { removeWhiteSpace } from "./util/index.ts";
import JsonToTS from "../src/index.ts";

describe("Root array type", function () {
  it("should throw error on unsupprted array types", function () {
    const unsupportedArrays = [
      ["sample string", "sample string2"],
      [42, 32],
      [true, false],
      [null, null],
      [42, "sample string"],
      [42, { marius: "marius" }],
      [],
    ];

    const expectedMessage = "Only (Object) and (Array of Object) are supported";

    unsupportedArrays.forEach((arr) => {
      try {
        JsonToTS(arr);
        assert.ok(false, "error should be thrown");
      } catch (e) {
        const err = e as Error;
        assert.strictEqual(err.message, expectedMessage);
        if (err.message !== expectedMessage) throw err;
      }
    });
  });

  it("should handle array with single object [object]", function () {
    const json = [{ marius: "marius" }];

    const expectedTypes = [
      `interface RootObject {
        marius: string;
      }`,
    ].map(removeWhiteSpace);

    const interfaces = JsonToTS(json);

    interfaces.forEach((i) => {
      const noWhiteSpaceInterface = removeWhiteSpace(i);
      assert.ok(expectedTypes.includes(noWhiteSpaceInterface));
    });
    assert.equal(interfaces.length, 1);
  });

  it("should handle array with multiple same objects [object, object]", function () {
    const json = [{ marius: "marius" }, { marius: "marius" }];

    const expectedTypes = [
      `interface RootObject {
        marius: string;
      }`,
    ].map(removeWhiteSpace);

    const interfaces = JsonToTS(json);

    interfaces.forEach((i) => {
      const noWhiteSpaceInterface = removeWhiteSpace(i);
      assert.ok(expectedTypes.includes(noWhiteSpaceInterface));
    });
    assert.equal(interfaces.length, 1);
  });

  it("should handle array with multiple different objects [object1, object2]", function () {
    const json = [{ marius: "marius" }, { darius: "darius" }];

    const expectedTypes = [
      `interface RootObject {
        marius?: string;
        darius?: string;
      }`,
    ].map(removeWhiteSpace);

    const interfaces = JsonToTS(json);

    interfaces.forEach((i) => {
      const noWhiteSpaceInterface = removeWhiteSpace(i);
      assert.ok(expectedTypes.includes(noWhiteSpaceInterface));
    });
    assert.equal(interfaces.length, 1);
  });

  it("should export when specified", function () {
    const json = [{ marius: "marius" }, { darius: "darius" }];

    const expectedTypes = [
      `export interface RootObject {
        marius?: string;
        darius?: string;
      }`,
    ].map(removeWhiteSpace);

    const interfaces = JsonToTS(json, { export: true });

    interfaces.forEach((i) => {
      const noWhiteSpaceInterface = removeWhiteSpace(i);
      assert.ok(expectedTypes.includes(noWhiteSpaceInterface));
    });
    assert.equal(interfaces.length, 1);
  });

  it("should export even if root name is different", function () {
    const json = [{ marius: "marius" }, { darius: "darius" }];

    const expectedTypes = [
      `export interface Foos {
        marius?: string;
        darius?: string;
      }`,
    ].map(removeWhiteSpace);

    const interfaces = JsonToTS(json, { rootName: "Foos", export: true });

    interfaces.forEach((i) => {
      const noWhiteSpaceInterface = removeWhiteSpace(i);
      assert.ok(expectedTypes.includes(noWhiteSpaceInterface));
    });
    assert.equal(interfaces.length, 1);
  });
});
