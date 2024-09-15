import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import { uuid } from '@/utils/uuid'

export const rootNodeId = 'root'

export const vsNodeTypes = ['folder', 'source'] as const

export type VSNodeTypes = (typeof vsNodeTypes)[number]

export interface VSNode<T = string> {
  pid: string
  id: string
  type: VSNodeTypes
  name: string
  remark: string
  api?: string
  children?: T[]
}

export type RVSNode = VSNode<RVSNode>

export const useVideoSourcesStore = defineStore('videoSources', () => {
  const { t } = useI18n()
  const treeRoot = {
    pid: '',
    id: rootNodeId,
    type: 'folder',
    name: t('videoSources'),
    remark: '',
  }
  const videoSources = reactive({
    [treeRoot.id]: treeRoot as VSNode,
  })

  const runtimeVideoSources = computed({
    get() {
      videoSources[treeRoot.id]
      const structureTree = (id: string): RVSNode => {
        const item = videoSources[id]
        return {
          ...item,
          children:
            item.type === 'folder' && item.children?.length ? item.children.map(id => structureTree(id)) : undefined,
        }
      }
      return [structureTree(treeRoot.id)]
    },
    set(val) {
      console.log('~~~~~!val', val)
    },
  })

  const addNode = (pid: string, node: VSNode) => {
    if (!videoSources[pid]) {
      return
    }
    node = formatNode(node)
    node.pid = pid
    if (!videoSources[pid].children) {
      videoSources[pid].children = []
    }
    videoSources[pid].children.push(node.id)
    videoSources[node.id] = node
    console.log('~~~~~! videoSources', videoSources)
  }

  return { treeRoot: treeRoot as RVSNode, videoSources, runtimeVideoSources, addNode }
})

function formatNode(node: VSNode): VSNode {
  node = { ...node }
  if (!node.id) {
    node.id = uuid()
  }
  switch (node.type) {
    case 'folder':
      delete node.api
      node.children = []
      break
    case 'source':
      delete node.children
      break
    default: {
      const type: never = node.type
      throw new Error(`unknown node ${type}`)
    }
  }
  return node
}
