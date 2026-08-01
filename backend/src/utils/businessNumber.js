import { getNextSequence } from "../repositories/sequence.repository.js";

export async function generateBusinessNumber(
  prefix,
  options = {}
) {
  const {
    includeYear = false,
    padding = 6,
  } = options;

  const sequence =
    await getNextSequence(prefix);

  const number = sequence
    .toString()
    .padStart(padding, "0");

  if (includeYear) {
    return `${prefix}-${new Date().getFullYear()}-${number}`;
  }

  return `${prefix}-${number}`;
}