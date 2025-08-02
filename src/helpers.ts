import { TDog } from "./types";

export const isDogPatchData = (
  obj: Partial<Omit<TDog, "id">>
): obj is Partial<Omit<TDog, "id">> => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    (!obj.name || typeof obj.name === "string") &&
    (!obj.age || typeof obj.age === "number") &&
    (!obj.breed || typeof obj.breed === "string") &&
    (!obj.description ||
      typeof obj.description === "string")
  );
};

export const checkKeysInObj = (
  keys: string[],
  keyType: string,
  obj: Record<string, unknown>,
  errors: string[]
) => {
  for (const key of keys) {
    if (!(key in obj) || typeof obj[key] !== keyType) {
      errors.push(`${key} should be a ${keyType}`);
    }
  }
};
export const checkForInvalidKeys = (
  keys: string[],
  obj: Record<string, unknown>,
  errors: string[]
) => {
  for (const key of Array.from(Object.keys(obj))) {
    if (!keys.includes(key)) {
      errors.push(`'${key}' is not a valid key`);
    }
  }
};
