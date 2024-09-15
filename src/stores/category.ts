import { computed, ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { useAppStore } from './app'
import getList from '@/api/list'
import { array2Tree } from '@/utils/array2Tree'

export const useCategoryStore = defineStore('category', () => {
  const app = useAppStore()
  const data = ref([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  watchEffect(() => {
    loading.value = true
    getList(app.api)
      .then(res => {
        if (!Array.isArray(res?.class)) {
          throw new Error('category is not an array')
        }
        data.value = res.class
      })
      .catch(err => (error.value = err))
      .finally(() => {
        loading.value = false
      })
  })

  const tree = computed(() => array2Tree(data.value, 'type_id', 'type_pid', 0))

  return { data, tree }
})
