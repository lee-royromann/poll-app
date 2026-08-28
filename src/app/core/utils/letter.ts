/** ASCII code of the first answer label, "A". */
const CHAR_CODE_A = 65;

/** Turns a zero-based index into the answer letter A, B, C … */
export function letter(index: number): string {
  return String.fromCharCode(CHAR_CODE_A + index);
}
