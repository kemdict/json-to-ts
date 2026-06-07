import type { KeyMetaData, TypeGroup, TypeDescription } from "./model.ts";

export function isHash(str: string) {
  return str.length === 40;
}

export function onlyUnique<T>(value: T, index: number, self: T[]) {
  return self.indexOf(value) === index;
}

export function isArray(x: any) {
  return Object.prototype.toString.call(x) === "[object Array]";
}

export function isNonArrayUnion(typeName: string) {
  const arrayUnionRegex = /^\(.*\)\[\]$/;

  return typeName.includes(" | ") && !arrayUnionRegex.test(typeName);
}

export function isObject(x: any) {
  return Object.prototype.toString.call(x) === "[object Object]" && x !== null;
}

export function isDate(x: any) {
  return x instanceof Date;
}

export function parseKeyMetaData(key: string): KeyMetaData {
  const isOptional = key.endsWith("--?");

  if (isOptional) {
    return {
      isOptional,
      keyValue: key.slice(0, -3),
    };
  } else {
    return {
      isOptional,
      keyValue: key,
    };
  }
}

export function getTypeDescriptionGroup(desc: TypeDescription | undefined): TypeGroup {
  if (desc === undefined) {
    return "primitive";
  } else if (desc.arrayOfTypes !== undefined) {
    return "array";
  } else {
    return "object";
  }
}

export function findTypeById(id: string, types: TypeDescription[]): TypeDescription | undefined {
  return types.find((_) => _.id === id);
}
