import { isHash, findTypeById, isNonArrayUnion } from "./util.ts";
import type { InterfaceDescription, NameEntry, TypeStructure, KeyMetaData, Options } from "./model.ts";

function isKeyNameValid(keyName: string) {
  const regex = /^[a-zA-Z_][a-zA-Z\d_]*$/;
  return regex.test(keyName);
}

function parseKeyMetaData(key: string): KeyMetaData {
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

function findNameById(id: string, names: NameEntry[]): string {
  const foundName = names.find((_) => _.id === id);
  if (!foundName) throw new Error("Name not found");
  return foundName.name;
}

function removeUndefinedFromUnion(unionTypeName: string) {
  const typeNames = unionTypeName.split(" | ");
  const undefinedIndex = typeNames.indexOf("undefined");
  typeNames.splice(undefinedIndex, 1);
  return typeNames.join(" | ");
}

function replaceTypeObjIdsWithNames(typeObj: { [index: string]: string }, names: NameEntry[]): object {
  return (
    Object.entries(typeObj)
      // quote key if is invalid and question mark if optional from array merging
      .map(([key, type]): [string, string, boolean] => {
        const { isOptional, keyValue } = parseKeyMetaData(key);
        const isValid = isKeyNameValid(keyValue);

        const validName = isValid ? keyValue : `'${keyValue}'`;

        return isOptional ? [`${validName}?`, type, isOptional] : [validName, type, isOptional];
      })
      // replace hashes with names referencing the hashes
      .map(([key, type, isOptional]): [string, string, boolean] => {
        if (!isHash(type)) {
          return [key, type, isOptional];
        }

        const newType = findNameById(type, names);
        return [key, newType, isOptional];
      })
      // if union has undefined, remove undefined and make type optional
      .map(([key, type, isOptional]): [string, string, boolean] => {
        if (!(isNonArrayUnion(type) && type.includes("undefined"))) {
          return [key, type, isOptional];
        }

        const newType = removeUndefinedFromUnion(type);
        const newKey = isOptional ? key : `${key}?`; // if already optional dont add question mark
        return [newKey, newType, isOptional];
      })
      // make undefined optional and set type as any
      .map(([key, type, isOptional]): [string, string, boolean] => {
        if (type !== "undefined") {
          return [key, type, isOptional];
        }

        const newType = "any";
        const newKey = isOptional ? key : `${key}?`; // if already optional dont add question mark
        return [newKey, newType, isOptional];
      })
      .reduce(
        (agg, [key, value]) => {
          agg[key] = value;
          return agg;
        },
        {} as Record<string, string>
      )
  );
}

export function getInterfaceStringFromDescription({
  name,
  typeMap,
  options,
}: InterfaceDescription & { options: Options }): string {
  const stringTypeMap = Object.entries(typeMap)
    .map(([key, name]) => `  ${key}: ${name};\n`)
    .reduce((a, b) => (a += b), "");

  const useTypeAlias = options.useTypeAlias;
  const exportKeyword = options.export && name === options.rootName ? "export " : "";
  const declarationKeyWord = useTypeAlias ? "type" : "interface";
  let result = `${exportKeyword}${declarationKeyWord} ${name}${useTypeAlias ? " =" : ""} {\n`;
  result += stringTypeMap;
  result += "}";

  return result;
}

export function getInterfaceDescriptions(typeStructure: TypeStructure, names: NameEntry[]): InterfaceDescription[] {
  return names
    .map(({ id, name }) => {
      const typeDescription = findTypeById(id, typeStructure.types);

      if (typeDescription?.typeObj) {
        const typeMap = replaceTypeObjIdsWithNames(typeDescription.typeObj, names);
        return { name, typeMap };
      } else {
        return null;
      }
    })
    .filter((_) => _ !== null);
}
