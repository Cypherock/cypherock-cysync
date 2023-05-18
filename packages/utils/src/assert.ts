export function assert<T>(
  condition: T,
  error: string | Error,
): asserts condition is Exclude<T, null | undefined> {
  if (
    condition === null ||
    condition === undefined ||
    (condition as any) === false
  ) {
    if (typeof error === 'string') {
      throw new Error(`AssertionError: ${error}`);
    } else {
      throw error;
    }
  }
}
