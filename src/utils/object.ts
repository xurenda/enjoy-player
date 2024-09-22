export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}

export function mapObject<T extends Record<string, any>>(obj: T, fn: (value: any, key: string) => any) {
  const ret: Record<string, any> = {}
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      ret[k] = fn(obj[k], k)
    }
  }
  return ret
}
