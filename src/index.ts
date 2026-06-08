import { getTypeStructure, optimizeTypeStructure } from "./get-type-structure.ts";
import type { Options, State } from "./model.ts";
import { getInterfaceDescriptions, getInterfaceStringFromDescription } from "./get-interfaces.ts";
import { getNames } from "./get-names.ts";
import { isArray, isObject } from "./util.ts";

export function JsonToTS(json: any, options?: Options): string[] {
  const state = {
    keyName: options?.rootName ?? "RootObject",
    export: !!options?.export,
    useTypeAlias: !!options?.useTypeAlias,
  } satisfies State;

  /**
   * Parsing currently works with (Objects) and (Array of Objects) not and primitive types and mixed arrays etc..
   * so we shall validate, so we dont start parsing non Object type
   */
  const isArrayOfObjects = isArray(json) && json.length > 0 && json.reduce((a: any, b: any) => a && isObject(b), true);

  if (!(isObject(json) || isArrayOfObjects)) {
    throw new Error("Only (Object) and (Array of Object) are supported");
  }

  const typeStructure = getTypeStructure(json);
  /**
   * due to merging array types some types are switched out for merged ones
   * so we delete the unused ones here
   */
  optimizeTypeStructure(typeStructure);

  const names = getNames(typeStructure, state);

  return getInterfaceDescriptions(typeStructure, names).map((description) =>
    getInterfaceStringFromDescription({ ...description, state })
  );
}

export default JsonToTS;
