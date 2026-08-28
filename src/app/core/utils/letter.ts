/** Turns a zero-based index into the answer letter A, B, C … */
export function letter(index: number): string {
  return String.fromCharCode(65 + index);
}
