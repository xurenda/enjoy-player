import { watch, type WatchSource } from 'vue'

export default function useWatchDebouncedValue<T>(watchSources: WatchSource<T>, cb: (val: T) => void, delay = 300) {
  let timer: number | null = null

  watch(watchSources, val => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      cb(val)
      timer = null
    }, delay)
  })
}
