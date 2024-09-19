import { ref, watch, type Ref } from 'vue'

export default function useDebounceRef<T>(watchSources: () => T, delay: number): Ref<T> {
  const debouncedValue = ref<T>(watchSources()) as Ref<T>
  let timer: number | null = null

  watch(watchSources, val => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      debouncedValue.value = val
      timer = null
    }, delay)
  })

  return debouncedValue
}
