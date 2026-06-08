# @kemdict/json-to-ts

Fork of [MariusAlch/json-to-ts](https://github.com/MariusAlch/json-to-ts).

Convert json object to typescript interfaces

## Why

```json
"dependencies": {
  "es7-shim": "^6.0.0",
  "hash.js": "^1.0.3",
  "pluralize": "^3.1.0"
}
```

And also to customize to my own use.

Much thanks to the original author, MariusAlch, for making this in the first
place. Me complaining about details is easy, but getting a project like this
started is the hard part which they have already graciously done.

## Changes from original

- ESM with both default export and named export
- Far less dependencies (from +106 to +2, mostly from removing es7-shim)
- Requires a Node-compatible runtime (for `hash` from `node:crypto`). (I decided against [`window.crypto.subtle.digest`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest) since it's async.)

## Features

Original features:

- Array type merging
- Union types
- Duplicate type prevention
- Optional types
- Array types

## Install

```sh
$ npm install @kemdict/json-to-ts
```

## Example

```javascript
import { JsonToTS } from "@kemdict/json-to-ts";

const json = {
  cats: [{ name: "Kittin" }, { name: "Mittin" }],
  favoriteNumber: 42,
  favoriteWord: "Hello",
};

JsonToTS(json).forEach((typeInterface) => {
  console.log(typeInterface);
});
```

This prints:

```typescript
interface RootObject {
  cats: Cat[];
  favoriteNumber: number;
  favoriteWord: string;
}
interface Cat {
  name: string;
}
```

## Options

```typescript
import { JsonToTS } from "@kemdict/json-to-ts";
const value = [{"a": 3}, {"b": 4}]
JsonToTS(value, {
  // The name of the generated root type
  rootName: "RootObject",
  // Whether to use `type Foo = { ... }` instead.
  // Default (false) is to use `interface Foo { ... }`.
  useTypeAlias: false
})
```
