import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import useVideoSourcesStore, { rootNodeId, type VSNode } from './videoSources'

export const useAppStore = defineStore(
  'app',
  () => {
    const videoSourcesStore = useVideoSourcesStore()
    const curVideoSourceId = ref('')

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

    return { curVideoSources, curVideoSourceId, curVideoSourceIdPath }
  },
  {
    persist: true,
  },
)
