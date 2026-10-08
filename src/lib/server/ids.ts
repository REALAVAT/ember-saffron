import "server-only";
import { randomInt } from "node:crypto";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function createReference(prefix: string, length = 6) {
  let id = "";
  for (let i = 0; i < length; i++) id += alphabet[randomInt(alphabet.length)];
  return `${prefix}-${id}`;
}
