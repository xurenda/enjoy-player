export function isPromiseLike<T>(val: unknown): val is Promise<T> {
  return !!val && typeof (val as Promise<T>).then === 'function'
}
