import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import getDetail, { type VideoDetailResponse } from '@/api/detail'
import useAppStore from './app'
import useRequest from '@/hooks/useRequest'

const useVideoDetailStore = defineStore('videoDetail', () => {
  const route = useRoute()
  const appStore = useAppStore()

  const response = useRequest<VideoDetailResponse | undefined>(async () => {
    const id = Number(route.params.id)
    if (!id || !appStore.curVideoSources?.api) {
      return
    }
    const res = await getDetail(appStore.curVideoSources.api, {
      ids: [id],
    })
    if (!res?.list?.[0]) {
      throw new Error('no data')
    }
    return res.list[0]
  }, undefined)

  return {
    ...response,
  }
})

export default useVideoDetailStore
