export function sleep(ms: number) {
  return new Promise<void>((resolve, reject) => {
    if (
      ms > 24 * 60 * 60 * 1000 ||
      Number.isNaN(ms) ||
      !Number.isFinite(ms) ||
      ms < 0 ||
      !Number.isInteger(ms)
    ) {
      reject(new Error('Invalid time'));
    }
    setTimeout(resolve, ms);
  });
}
