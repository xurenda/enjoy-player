import { customRef, isRef, ref, type Ref } from 'vue'

export default function useDebounceRef<T>(value: T | Ref<T>, delay = 300) {
  const valueRef = isRef(value) ? value : (ref(value) as Ref<T>)
  let timer: number | null = null
  return customRef((track, trigger) => ({
    get() {
      track()
      return valueRef.value
    },
    set(val) {
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        valueRef.value = val
        timer = null
        trigger()
      }, delay)
    },
  }))
}
