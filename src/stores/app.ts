import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import useVideoSourcesStore, { rootNodeId, type VSNode } from './videoSources'
import { watchEffect } from 'vue'
import axios from 'axios'

const useAppStore = defineStore(
  'app',
  () => {
    const videoSourcesStore = useVideoSourcesStore()
    const curVideoSourceId = ref('')

    watchEffect(() => {
      if (!videoSourcesStore.data[curVideoSourceId.value]) {
        const firstSource = Object.values(videoSourcesStore.data).find(item => item.type === 'source' && item.api)?.id
        if (firstSource) {
          curVideoSourceId.value = firstSource
        }
      }
    })

    const curVideoSourceIdPath = computed<string[]>({
      get() {
        const path: string[] = []
        const makePath = (id: string) => {
          if (id === rootNodeId) {
            path.push(id)
            return
          }
          const item = videoSourcesStore.data[id]
          if (!item) {
            return
          }
          makePath(item.pid)
          path.push(item.id)
        }
        makePath(curVideoSourceId.value)
        return path
      },
      set(val) {
        curVideoSourceId.value = val[val.length - 1]
      },
    })
    const curVideoSources = computed<VSNode | null>(() => videoSourcesStore.data[curVideoSourceId.value] ?? null)

    // -------------------- Version ------------------------

    const curVersion = __curVersion__
    const latestVersionLoading = ref(false)
    const latestVersion = ref('')

    const fetchLatestVersion = () => {
      latestVersionLoading.value = true
      axios
        .get('https://api.github.com/repos/xurenda/enjoy-player/releases/latest')
        .then(res => {
          latestVersion.value = res?.data?.tag_name || ''
        })
        .finally(() => {
          latestVersionLoading.value = false
        })
    }

    fetchLatestVersion()

    return {
      curVideoSources,
      curVideoSourceId,
      curVideoSourceIdPath,
      curVersion,
      latestVersionLoading,
      latestVersion,
      fetchLatestVersion,
    }
  },
  {
    persist: true,
  },
)

export default useAppStore
