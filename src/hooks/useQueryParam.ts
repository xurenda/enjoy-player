import { useRoute, useRouter } from 'vue-router'
import useSingleQueryParam from './useSingleQueryParam'

export interface QueryParamConfig<T> {
  defaultValue: T
  transFn?: (value: string) => T
}

export default function useQueryParam(configs: Record<string, QueryParamConfig<any>>) {
  const route = useRoute()
  const router = useRouter()

  const data: Record<string, any> = {}
  for (const k in configs) {
    if (Object.prototype.hasOwnProperty.call(configs, k)) {
      const { defaultValue, transFn } = configs[k]
      data[k] = useSingleQueryParam(k, defaultValue, transFn, true)
    }
  }

  const change = (data: Record<string, any>) => {
    const query: Record<string, any> = {}
    for (const k in data) {
      if (Object.prototype.hasOwnProperty.call(data, k)) {
        if (!configs[k]) {
          query[k] = data[k]
        }
        const { defaultValue, transFn } = configs[k]
        if (data[k] === defaultValue) {
          query[k] = undefined
        } else {
          query[k] = transFn ? transFn(data[k]) : data[k]
        }
      }
    }
    router.replace({
      query: {
        ...route.query,
        ...query,
      },
    })
  }

  return {
    data,
    change,
  }
}
