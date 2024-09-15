import { computed, ref } from 'vue'
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

export interface VSPersistentData {
  root: string
  record: Record<string, VSNode>
}

const useVideoSourcesStore = defineStore(
  'videoSources',
  () => {
    const { t } = useI18n()
    const treeRoot = {
      pid: '',
      id: rootNodeId,
      type: 'folder',
      name: t('videoSources'),
      remark: '',
    }
    const videoSources = ref<Record<string, VSNode>>({
      [treeRoot.id]: { ...treeRoot } as VSNode,
    })

    const runtimeVideoSources = computed({
      get() {
        const makeTree = (id: string): RVSNode => {
          const item = videoSources.value[id]
          return {
            ...item,
            children:
              item.type === 'folder' && item.children?.length ? item.children.map(id => makeTree(id)) : undefined,
          }
        }
        videoSources.value[rootNodeId].name = t('videoSources')
        return [makeTree(treeRoot.id)]
      },
      set(tree) {
        const root: VSNode = { ...(treeRoot as VSNode) }
        const record = makeFlat(root, tree[0].children)
        record[root.id] = root
        videoSources.value = record
      },
    })

    const addNode = (pid: string, node: VSNode) => {
      if (!videoSources.value[pid]) {
        return
      }
      node = formatNode(node)
      node.pid = pid
      if (!videoSources.value[pid].children) {
        videoSources.value[pid].children = []
      }
      videoSources.value[pid].children.push(node.id)
      videoSources.value[node.id] = node
    }

    const editNode = (node: VSNode) => {
      if (!videoSources.value[node.id]) {
        return
      }
      node = formatNode(node)
      videoSources.value[node.id] = { ...videoSources.value[node.id], ...node }
    }

    const deleteNode = (id: string) => {
      if (id === rootNodeId) {
        videoSources.value = { [rootNodeId]: { ...treeRoot } as VSNode }
        return
      }
      if (!videoSources.value[id]) {
        return
      }
      const pid = videoSources.value[id].pid
      videoSources.value[pid].children = videoSources.value[pid].children?.filter(i => i !== id)
      videoSources.value[id].children?.forEach(id => deleteNode(id))
      delete videoSources.value[id]
    }

    const importNode = (data: VSPersistentData, pid: string) => {
      const { root: rootId, record } = data
      const newRecord: Record<string, VSNode> = {}
      const idMap = new Map<string, string>()
      const isImportRoot = rootId === pid && rootId === rootNodeId
      if (isImportRoot) {
        idMap.set(rootNodeId, rootNodeId)
      }
      const getNewId = (id: string) => {
        if (idMap.has(id)) {
          return idMap.get(id)!
        }
        const newId = uuid()
        idMap.set(id, newId)
        return newId
      }
      const process = (id: string, pid: string) => {
        let item = record[id]
        if (!item) {
          return
        }
        item = formatNodeDeep(item, pid, getNewId(id))
        const children = item.children?.filter(i => record[i] !== null && typeof record[i] === 'object')
        if (children?.length) {
          item.children = children.map(i => {
            process(i, item.id)
            return getNewId(i)
          })
        }
        newRecord[item.id] = item
      }
      process(rootId, pid)

      if (isImportRoot) {
        if (newRecord[rootId].children?.length) {
          videoSources.value[rootNodeId].children = videoSources.value[rootNodeId].children || []
          videoSources.value[rootNodeId].children.push(...newRecord[rootId].children)
        }
        delete newRecord[rootId]
      } else {
        videoSources.value[pid].children = videoSources.value[pid].children || []
        const newId = getNewId(rootId)
        videoSources.value[pid].children.push(newId)
        newRecord[newId].pid = pid
      }
      Object.values(newRecord).forEach(item => {
        videoSources.value[item.id] = item
      })
    }

    return {
      treeRoot: treeRoot as RVSNode,
      videoSources,
      runtimeVideoSources,
      addNode,
      editNode,
      deleteNode,
      importNode,
    }
  },
  {
    persist: true,
  },
)

export default useVideoSourcesStore

export function toPersistentData(node: RVSNode): VSPersistentData {
  const children = node.children
  const root = {
    ...node,
    children: undefined,
  } as VSNode
  const record = makeFlat(root, children)
  record[root.id] = root
  return {
    root: root.id,
    record,
  }
}

function formatNode(node: VSNode): VSNode {
  node = { ...node }
  delete node.children
  if (!node.id) {
    node.id = uuid()
  }
  if (node.type === 'folder') {
    delete node.api
  }
  return node
}

function formatNodeDeep(node: VSNode, pid: string, id?: string): VSNode {
  node = {
    pid: node.pid,
    id: node.id,
    type: node.type,
    name: node.name,
    remark: node.remark,
    api: node.api,
    children: node.children?.filter(i => typeof i === 'string'),
  }
  if (node.pid !== pid) {
    node.pid = pid
  }
  if (id && node.id !== id) {
    node.id = id
  }
  if (!node.id) {
    node.id = uuid()
  }
  if (!vsNodeTypes.includes(node.type)) {
    if (/^https?:\/\//.test(node.api || '')) {
      node.type = 'source'
    } else {
      node.type = 'folder'
    }
  }
  switch (node.type) {
    case 'folder':
      delete node.api
      break
    case 'source':
      delete node.children
      break
  }
  return node
}

function makeFlat(node: VSNode, children?: RVSNode[]): Record<string, VSNode> {
  const record: Record<string, VSNode> = {}
  const _makeFlat = (parent: VSNode, children?: RVSNode[]) => {
    if (!children?.length) {
      return
    }
    children.forEach(i => {
      const item = { ...i, children: undefined } as VSNode
      record[item.id] = item
      parent.children = parent.children || []
      parent.children.push(item.id)
      _makeFlat(item, i.children)
    })
  }
  _makeFlat(node, children)
  return record
}
