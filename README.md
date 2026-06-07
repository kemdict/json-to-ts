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

Much thanks to the original author, MariusAlch, for making this in the first place. Me complaining about details is easy, but getting a project like this started is the hard part which they have already graciously done.

## Install

```sh
$ npm install @kemdict/json-to-ts
```

## Example

```javascript
import JsonToTS from "@kemdict/json-to-ts";

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

## Features

Original features:

- Array type merging
- Union types
- Duplicate type prevention
- Optional types
- Array types
