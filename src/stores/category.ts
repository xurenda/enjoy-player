import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import useAppStore from './app'
import getList, { type CategoryResponse } from '@/api/list'
import { array2Tree } from '@/utils/array2Tree'
import useRequest from '@/hooks/useRequest'
import { useI18n } from 'vue-i18n'

export const allCategoryId = -1

const useCategoryStore = defineStore('category', () => {
  const appStore = useAppStore()
  const { t } = useI18n()
  const curCategory = ref(allCategoryId)

  const allCategory = {
    type_id: allCategoryId,
    type_name: t('all'),
    type_pid: 0,
  }

  const defaultRes: CategoryResponse[] = []

  const response = useRequest<CategoryResponse[]>(async () => {
    if (!appStore.curVideoSources?.api) {
      return defaultRes
    }
    const res = await getList(appStore.curVideoSources.api)
    if (!Array.isArray(res?.class)) {
      throw new Error('category is not an array')
    }
    return res.class
  }, defaultRes)

  const tree = computed(() => {
    const tree = array2Tree(response.data.value, 'type_id', 'type_pid', 0)
    tree.unshift(allCategory)
    return tree
  })

  return { ...response, tree, curCategory }
})

export default useCategoryStore
