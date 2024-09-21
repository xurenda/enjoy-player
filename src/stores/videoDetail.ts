import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import getDetail, { type VideoDetailResponse } from '@/api/detail'
import useAppStore from './app'
import useSingleQueryParam from '@/hooks/useSingleQueryParam'
import { computed, ref, watch } from 'vue'
import useVideoListStore from './videoList'

const details = new Map<number, VideoDetailResponse>()

const useVideoDetailStore = defineStore('videoDetail', () => {
  const route = useRoute()
  const appStore = useAppStore()
  const videoListStore = useVideoListStore()
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

  const loading = ref(false)
  const error = ref<Error | null>(null)
  const data = ref<VideoDetailResponse | null>(null)

  const fetchDetail = async (id: string) => {
    const idNum = Number(id)
    if (!idNum || Number.isNaN(idNum)) {
      throw new Error('no id')
    }
    const detail = details.get(idNum)
    if (detail) {
      return detail
    }
    const found: VideoDetailResponse | undefined = videoListStore.list.find(v => v.vod_id === idNum)
    if (found) {
      details.set(idNum, found)
      return found
    }
    if (!appStore.curVideoSources?.api) {
      return null
    }
    const res = await getDetail(appStore.curVideoSources.api, {
      ids: [id],
    })
    if (!res?.list?.[0]) {
      throw new Error('no data')
    }
    details.set(idNum, res.list[0])
    return res.list[0]
  }

  watch(
    () => route.params.id,
    id => {
      loading.value = true
      error.value = null
      data.value = null
      fetchDetail(id as string)
        .then(detail => {
          loading.value = false
          error.value = null
          data.value = detail
        })
        .catch(error => {
          loading.value = false
          error.value = error
          data.value = null
        })
    },
    {
      immediate: true,
    },
  )

  const curEpisode = computed(() => ({
    idx: curEpisodeIdx.value,
    ...data.value?.vod_play_url?.[curEpisodeIdx.value],
  }))

  return {
    loading,
    error,
    data,
    curEpisode,
    curEpisodeIdx,
    changeEpisode,
  }
})

export default useVideoDetailStore
