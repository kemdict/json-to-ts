export type TypeGroup = "primitive" | "array" | "object" | "date";

export type TypeGroupWithDescription =
  | {
      group: "primitive";
      desc: undefined;
    }
  | { group: "array"; desc: TypeDescriptionWithArrayOfTypes }
  | { group: "object"; desc: TypeDescriptionWithTypeObj };

export interface TypeDescription {
  id: string;
  isUnion?: boolean;
  typeObj?: { [index: string]: string };
  arrayOfTypes?: string[];
}

export interface TypeDescriptionWithArrayOfTypes extends TypeDescription {
  arrayOfTypes: string[];
}
export interface TypeDescriptionWithTypeObj extends TypeDescription {
  typeObj: { [index: string]: string };
}

export interface TypeStructure {
  rootTypeId: string;
  types: TypeDescription[];
}

export interface NameEntry {
  id: string;
  name: string;
}

export interface NameStructure {
  rootName: string;
  names: NameEntry[];
}

export interface InterfaceDescription {
  name: string;
  typeMap: object;
}

export interface Options {
  /** The name of the generated root type */
  rootName?: string;
  /** A prefix added before all types generated, including the root type
   *  (TODO it shouldn't) */
  prefix?: string;
  /** Whether to generate `type Foo = { ... }` instead of interface */
  useTypeAlias?: boolean;
}

export interface KeyMetaData {
  keyValue: string;
  isOptional: boolean;
}
