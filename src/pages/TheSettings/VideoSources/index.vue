<template>
  <div class="h-full">
    <div
      v-if="!videoSources.runtimeVideoSources[0].children?.length"
      className="flex h-full flex-1 items-center justify-center"
    >
      <a-empty :description="t('noData')">
        <a-button @click="() => openFileSelector(treeRoot)">
          {{ t('import') }}
        </a-button>
        <span class="mx-2"></span>
        <a-button @click="() => openModal('add', treeRoot)">
          {{ t('add') }}
        </a-button>
      </a-empty>
    </div>
    <div v-else className="h-full overflow-auto">
      <Draggable
        v-model="videoSources.runtimeVideoSources"
        treeLine
        textKey="name"
        :rootDroppable="false"
        :eachDraggable="stat => stat.data.id !== treeRoot.id"
        :eachDroppable="stat => stat.data.type === 'folder'"
        :nodeKey="stat => stat.data.key"
      >
        <template #default="{ node, stat }: { node: RVSNode; stat: Stat }">
          <div class="group box-border flex cursor-pointer items-center rounded-lg px-2 py-1 hover:bg-slate-100">
            <div class="mr-2">
              <template v-if="node.type === 'folder'">
                <i v-if="!node.children?.length" class="iconfont icon-folder-empty"></i>
                <i v-else-if="stat.open" class="iconfont icon-folder-open" @click="stat.open = !stat.open"></i>
                <i v-else class="iconfont icon-folder" @click="stat.open = !stat.open"></i>
              </template>
              <i v-else class="iconfont icon-file"></i>
            </div>
            <div class="flex-1" @click="openModal('edit', node)">{{ node.name }}</div>
            <div class="opacity-0 group-hover:opacity-100">
              <a-tooltip :title="t('import')">
                <a-button v-if="node.type === 'folder'" size="small" type="text" @click="openFileSelector(node)">
                  <template #icon>
                    <i class="iconfont icon-import"></i>
                  </template>
                </a-button>
              </a-tooltip>
              <a-tooltip :title="t('export')">
                <a-button size="small" type="text" @click="exportVideoSources(node)">
                  <template #icon>
                    <i class="iconfont icon-export"></i>
                  </template>
                </a-button>
              </a-tooltip>
              <a-tooltip :title="t('add')">
                <a-button v-if="node.type === 'folder'" size="small" type="text" @click="openModal('add', node)">
                  <template #icon>
                    <i class="iconfont icon-add"></i>
                  </template>
                </a-button>
              </a-tooltip>
              <a-tooltip :title="t('delete.title')">
                <a-button size="small" type="text" @click="handleDelete(node)">
                  <template #icon>
                    <i class="iconfont icon-delete"></i>
                  </template>
                </a-button>
              </a-tooltip>
            </div>
          </div>
        </template>
      </Draggable>
    </div>

    <a-modal
      centered
      destroyOnClose
      v-model:open="modalOpen"
      :title="t(modalType)"
      :cancelText="t('cancel')"
      :okText="t('ok')"
      @ok="handleOk"
    >
      <SourcesModal :type="modalType" :node="curNode" ref="sourcesModal" />
    </a-modal>
    <input ref="fileRef" class="hidden" type="file" accept=".json" multiple @change="fileInputChange" />
    <contextHolder />
  </div>
</template>

<script setup lang="ts">
import useVideoSourcesStore, { toPersistentData, type RVSNode, type VSPersistentData } from '@/stores/videoSources'
import { Draggable, type PropDraggable } from '@he-tree/vue'
import { useI18n } from 'vue-i18n'
import SourcesModal, { type SourcesModalProps } from './SourcesModal.vue'
import { ref, unref, useTemplateRef } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import '@he-tree/vue/style/default.css'
import { createFile, downloadFile, readFileAsJson } from '@/utils/file'

defineOptions({
  name: 'VideoSources',
})

type Stat = Parameters<PropDraggable>[0]

const { t } = useI18n()
const videoSources = useVideoSourcesStore()
const { treeRoot } = videoSources
const [messageApi, contextHolder] = message.useMessage()
const modalOpen = ref(false)
const modalType = ref<SourcesModalProps['type']>('add')
const curNode = ref<SourcesModalProps['node']>(treeRoot)
const sourcesModalRef = useTemplateRef<ComponentExposed<typeof SourcesModal>>('sourcesModal')
const fileRef = useTemplateRef<HTMLInputElement>('fileRef')

const openModal = (type: SourcesModalProps['type'], node: SourcesModalProps['node']) => {
  modalType.value = type
  curNode.value = unref(node)
  modalOpen.value = true
}

const handleDelete = (node: RVSNode) => {
  if (node.type === 'folder' && node.children?.length) {
    Modal.confirm({
      title: t('delete.confirm'),
      content: t('delete.hasChildren'),
      okText: t('ok'),
      cancelText: t('cancel'),
      onOk() {
        videoSources.deleteNode(node.id)
      },
    })
  } else {
    videoSources.deleteNode(node.id)
  }
}

const handleOk = async () => {
  try {
    const values = await sourcesModalRef.value?.validate()
    switch (modalType.value) {
      case 'add':
        videoSources.addNode(curNode.value.id, values)
        break
      case 'edit':
        videoSources.editNode({ ...curNode.value, ...values })
        break
    }
    modalOpen.value = false
  } catch (error) {
    // ignore
  }
}

const exportVideoSources = (node: RVSNode) => {
  const data = toPersistentData(node)
  downloadFile(createFile(data, 'application/json'), `${node.name}.json`)
}

const openFileSelector = (node: RVSNode) => {
  if (!fileRef.value) {
    return
  }
  fileRef.value.value = ''
  curNode.value = unref(node)
  fileRef.value.click()
}

const fileInputChange = (e: Event) => {
  const files = (e.target as HTMLInputElement)?.files
  if (!files?.length) {
    return
  }
  _importNodes(files, curNode.value.id)
}

const _importNodes = async (files: FileList, id: string) => {
  const importMsgKey = 'importMsg'
  const total = files.length
  let cur = 0
  let success = 0
  let fail = 0
  const _importNode = async (file: File) => {
    const data = await readFileAsJson<VSPersistentData>(file)
    videoSources.importNode(data, id)
  }
  for (const file of files) {
    messageApi.loading({ content: `${t('loading')}... (${++cur}/${total})`, key: importMsgKey })
    try {
      await _importNode(file)
      success++
    } catch (e) {
      console.log('[import Error]', e)
      fail++
    }
  }
  messageApi[fail > 0 ? 'error' : 'success']({
    content: `${t('success')}: ${success}; ${t('fail')}: ${fail}`,
    key: importMsgKey,
  })
}
</script>
