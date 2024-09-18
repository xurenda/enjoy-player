import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import getDetail, { type VideoDetailResponse } from '@/api/detail'
import useAppStore from './app'
import useRequest from '@/hooks/useRequest'
import useSingleQueryParam from '@/hooks/useSingleQueryParam'
import { computed } from 'vue'

const useVideoDetailStore = defineStore('videoDetail', () => {
  const route = useRoute()
  const videoId = computed(() => route.params.id)
  const appStore = useAppStore()
  const curEpisodeIdx = useSingleQueryParam('ep', 0, v => {
    const num = +v
    if (Number.isNaN(num) || num < 0 || !Number.isInteger(num)) {
      return 0
    }
    return num
  })

  const changeEpisode = (idx: number) => {
    curEpisodeIdx.value = idx
  }

  const response = useRequest<VideoDetailResponse | undefined>(async () => {
    const id = Number(videoId.value)
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

  const curEpisode = computed(() => ({
    idx: curEpisodeIdx.value,
    ...response.data.value?.vod_play_url?.[curEpisodeIdx.value],
  }))

  return {
    ...response,
    curEpisode,
    curEpisodeIdx,
    changeEpisode,
  }
})

export default useVideoDetailStore
