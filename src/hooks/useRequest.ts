import { isPromiseLike } from '@/utils/promise'
import { ref, watchEffect, type Ref } from 'vue'

export interface RequestData<T> {
  loading: Ref<boolean>
  error: Ref<Error | null>
  data: Ref<T>
}

export default function useRequest<T extends any>(getProm: () => Promise<T> | unknown, defaultData: T): RequestData<T> {
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const data = ref<T>(defaultData) as Ref<T>

  watchEffect(() => {
    const prom = getProm()
    if (isPromiseLike<T>(prom)) {
      loading.value = true
      error.value = null
      data.value = defaultData
      prom
        .then(res => (data.value = res))
        .catch(err => (error.value = err))
        .finally(() => {
          loading.value = false
        })
    } else {
      loading.value = false
      error.value = null
      data.value = defaultData
    }
  })
  return { loading, error, data }
}
