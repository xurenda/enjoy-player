import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default function useSingleQueryParam<T>(
  key: string,
  defaultValue: T,
  transFn: (value: string) => T = value => value as T,
) {
  const route = useRoute()
  const router = useRouter()

  return computed({
    get() {
      let val = route.query[key]
      if (Array.isArray(val)) {
        val = val[0]
      }
      if (!val) {
        return defaultValue
      }
      return transFn(val)
    },
    set(val) {
      const value = transFn(`${val}`)
      router.replace({
        query: {
          ...route.query,
          [key]: value === defaultValue ? undefined : `${value}`,
        },
      })
    },
  })
}
