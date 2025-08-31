export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
export async function fakeCall<T>(fn: () => T, failRate = 0.08, ms = 500): Promise<T> {
  await sleep(ms);
  if (Math.random() < failRate) throw new Error("Network error");
  return fn();
} 