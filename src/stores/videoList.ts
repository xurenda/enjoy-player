import { defineStore } from 'pinia'
import useAppStore from './app'
import getList from '@/api/list'
import useRequest from '@/hooks/useRequest'
import getDetail, { type VideoDetailResponse } from '@/api/detail'
import { ref } from 'vue'
import useCategoryStore, { allCategoryId } from './category'
import useSingleQueryParam from '@/hooks/useSingleQueryParam'

interface ListData {
  list: VideoDetailResponse[]
  total: number
}

const useVideoListStore = defineStore('videoList', () => {
  const appStore = useAppStore()
  const categoryStore = useCategoryStore()
  const word = useSingleQueryParam('word', '', value => value.trim())
  const curPage = ref(1)

  const defaultRes: ListData = {
    list: [],
    total: 0,
  }

  const response = useRequest<ListData>(async () => {
    if (!appStore.curVideoSources?.api) {
      return defaultRes
    }
    const res = await getList(appStore.curVideoSources.api, {
      pg: curPage.value,
      wd: word.value,
      t: categoryStore.curCategory !== allCategoryId ? categoryStore.curCategory : undefined,
    })
    if (!Array.isArray(res?.list)) {
      throw new Error('list is not an array')
    }
    if (!res.list.length) {
      return {
        list: [],
        total: res.total,
      }
    }
    const res2 = await getDetail(appStore.curVideoSources.api, {
      ids: res.list.map(i => i.vod_id),
    })
    if (!Array.isArray(res2?.list)) {
      throw new Error('list is not an array')
    }
    return {
      list: res2.list,
      total: res.total,
    }
  }, defaultRes)

  return { ...response, curPage }
})

export default useVideoListStore
