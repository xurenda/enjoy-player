import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import { uuid } from '@/utils/uuid'

export const rootNodeId = 'root'
export const vsNodeTypes = ['folder', 'source'] as const
export type VSNodeTypes = (typeof vsNodeTypes)[number]
export const imgRatios = ['9:16', '3:4', '1:1', '4:3', '16:9'] as const
export type ImgRatios = (typeof imgRatios)[number]
export const defaultImgRatio: ImgRatios = '3:4'

export interface VSNode<T = string> {
  pid: string
  id: string
  type: VSNodeTypes
  name: string
  imgRatio: ImgRatios
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
    const rootNode = {
      pid: '',
      id: rootNodeId,
      type: 'folder',
      name: t('videoSources'),
      remark: '',
    }
    const data = ref<Record<string, VSNode>>({
      [rootNode.id]: { ...rootNode } as VSNode,
    })

    const tree = computed({
      get() {
        const makeTree = (id: string): RVSNode => {
          const item = data.value[id]
          return {
            ...item,
            children:
              item.type === 'folder' && item.children?.length ? item.children.map(id => makeTree(id)) : undefined,
          }
        }
        data.value[rootNodeId].name = t('videoSources')
        return [makeTree(rootNode.id)]
      },
      set(tree) {
        const root: VSNode = { ...(rootNode as VSNode) }
        const record = makeFlat(root, tree[0].children)
        record[root.id] = root
        data.value = record
      },
    })

    const sourceCount = computed(() => {
      return Object.values(data.value).reduce((acc, node) => acc + (node.type === 'source' ? 1 : 0), 0)
    })

    const addNode = (pid: string, node: VSNode) => {
      if (!data.value[pid]) {
        return
      }
      node = formatNode(node)
      node.pid = pid
      if (!data.value[pid].children) {
        data.value[pid].children = []
      }
      data.value[pid].children.push(node.id)
      data.value[node.id] = node
    }

    const editNode = (node: VSNode) => {
      if (!data.value[node.id]) {
        return
      }
      node = formatNode(node)
      data.value[node.id] = { ...data.value[node.id], ...node }
    }

    const deleteNode = (id: string) => {
      if (id === rootNodeId) {
        data.value = { [rootNodeId]: { ...rootNode } as VSNode }
        return
      }
      if (!data.value[id]) {
        return
      }
      const pid = data.value[id].pid
      data.value[pid].children = data.value[pid].children?.filter(i => i !== id)
      data.value[id].children?.forEach(id => deleteNode(id))
      delete data.value[id]
    }

    const importNode = (persistentData: VSPersistentData, pid: string) => {
      const { root: rootId, record } = persistentData
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
          data.value[rootNodeId].children = data.value[rootNodeId].children || []
          data.value[rootNodeId].children.push(...newRecord[rootId].children)
        }
        delete newRecord[rootId]
      } else {
        data.value[pid].children = data.value[pid].children || []
        const newId = getNewId(rootId)
        data.value[pid].children.push(newId)
        newRecord[newId].pid = pid
      }
      Object.values(newRecord).forEach(item => {
        data.value[item.id] = item
      })
    }

    return {
      rootNode: rootNode as RVSNode,
      data,
      tree,
      sourceCount,
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
    imgRatio: node.imgRatio,
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
