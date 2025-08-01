import { TDog } from "./types";

export function isDog(obj: TDog): obj is TDog {
  return (
    typeof obj === "object" &&
    obj !== null &&
    (!obj.id || typeof obj.id === "number") &&
    typeof obj.description === "string" &&
    typeof obj.name === "string" &&
    typeof obj.age === "number"
  );
}

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

export const isValidDogEntry = ([key, value]: [
  string,
  unknown
]) => {
  switch (key) {
    case "name":
    case "description":
    case "breed":
      return typeof value === "string";
    case "age":
      return typeof value === "number";
    default:
      return false;
  }
};
