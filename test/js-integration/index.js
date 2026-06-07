import * as assert from "node:assert";
import { describe, it } from "node:test";

describe("Javascript integration", function () {
  it("should have both default and named exports", async () => {
    const { JsonToTS, default: JsonToTSDefault } = await import("../../dist/index.js");
    assert.ok(JsonToTS);
    assert.ok(JsonToTSDefault);
  });

  it("should work with dynamic import ", async () => {
    const { JsonToTS } = await import("../../dist/index.js");
    const expected = `
interface RootObject {
  cats: Cat[];
  favoriteNumber: number;
  favoriteWord: string;
}
interface Cat {
  name: string;
}`;

    const json = {
      cats: [{ name: "Kittin" }, { name: "Mittin" }],
      favoriteNumber: 42,
      favoriteWord: "Hello",
    };

    const output = JsonToTS(json)
      .reduce((type1, type2) => {
        return `${type1}\n${type2}`;
      })
      .trim();

    assert.strictEqual(output, expected.trim());
  });
});
