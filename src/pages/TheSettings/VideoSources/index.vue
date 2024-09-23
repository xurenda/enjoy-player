<template>
  <div class="h-full">
    <div v-if="!videoSourcesStore.tree[0].children?.length" className="flex h-full flex-1 items-center justify-center">
      <a-empty :description="t('noData')">
        <a-button @click="() => openFileSelector(rootNode)">
          {{ t('import') }}
        </a-button>
        <span class="mx-2"></span>
        <a-button @click="() => openModal('add', rootNode)">
          {{ t('add') }}
        </a-button>
      </a-empty>
    </div>
    <div v-else className="h-full overflow-auto">
      <Draggable
        v-model="videoSourcesStore.tree"
        treeLine
        textKey="name"
        :rootDroppable="false"
        :eachDraggable="stat => stat.data.id !== rootNode.id"
        :eachDroppable="stat => stat.data.type === 'folder'"
        :nodeKey="stat => stat.data.key"
      >
        <template #default="{ node, stat }: { node: RVSNode; stat: Stat }">
          <div
            :class="{ active: appStore.curVideoSourceId === node.id }"
            class="group box-border flex cursor-pointer items-center rounded-lg px-2 py-1 hover:bg-color-hover [&.active]:bg-color-primary/10 [&.active]:text-color-primary"
          >
            <div class="mr-2">
              <template v-if="node.type === 'folder'">
                <i v-if="!node.children?.length" class="iconfont icon-folder-empty"></i>
                <a-button v-else-if="stat.open" size="small" type="text" @click="stat.open = !stat.open">
                  <template #icon>
                    <i class="iconfont icon-folder-open"></i>
                  </template>
                </a-button>
                <a-button v-else size="small" type="text" @click="stat.open = !stat.open">
                  <template #icon>
                    <i class="iconfont icon-folder"></i>
                  </template>
                </a-button>
              </template>
              <i v-else class="iconfont icon-file"></i>
            </div>
            <div class="flex-1" @click="changeCurVideoSource(node, stat)">{{ node.name }}</div>
            <div class="opacity-0 group-hover:opacity-100">
              <a-tooltip :title="t('edit')">
                <a-button v-if="node.id !== rootNode.id" size="small" type="text" @click="openModal('edit', node)">
                  <template #icon>
                    <i class="iconfont icon-edit"></i>
                  </template>
                </a-button>
              </a-tooltip>
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
    <FileSelector ref="fileSelectorRef" @change="fileSelectorChange" />
    <contextHolder />
  </div>
</template>

<script setup lang="ts">
import useVideoSourcesStore, { type RVSNode } from '@/stores/videoSources'
import { Draggable, type PropDraggable } from '@he-tree/vue'
import { useI18n } from 'vue-i18n'
import SourcesModal, { type SourcesModalProps } from './SourcesModal.vue'
import { ref, unref, useTemplateRef } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import { exportVideoSources } from '@/handles/export'
import '@he-tree/vue/style/default.css'
import FileSelector from '@/components/FileSelector.vue'
import { getBackupData, importVideoSources } from '@/handles/import'
import useAppStore from '@/stores/app'

defineOptions({
  name: 'VideoSources',
})

type Stat = Parameters<PropDraggable>[0]

const { t } = useI18n()
const videoSourcesStore = useVideoSourcesStore()
const appStore = useAppStore()
const { rootNode } = videoSourcesStore
const [messageApi, contextHolder] = message.useMessage()
const modalOpen = ref(false)
const modalType = ref<SourcesModalProps['type']>('add')
const curNode = ref<SourcesModalProps['node']>(rootNode)
const sourcesModalRef = useTemplateRef<ComponentExposed<typeof SourcesModal>>('sourcesModal')
const fileSelectorRef = useTemplateRef<ComponentExposed<typeof FileSelector>>('fileSelectorRef')

const changeCurVideoSource = (node: RVSNode, stat: Stat) => {
  if (node.type === 'source') {
    appStore.curVideoSourceId = node.id
  } else {
    stat.open = !stat.open
  }
}

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
        videoSourcesStore.deleteNode(node.id)
      },
    })
  } else {
    videoSourcesStore.deleteNode(node.id)
  }
}

const handleOk = async () => {
  try {
    const values = await sourcesModalRef.value?.validate()
    switch (modalType.value) {
      case 'add':
        videoSourcesStore.addNode(curNode.value.id, values)
        break
      case 'edit':
        videoSourcesStore.editNode({ ...curNode.value, ...values })
        break
    }
    modalOpen.value = false
  } catch (error) {
    // ignore
  }
}

const openFileSelector = (node: RVSNode) => {
  if (fileSelectorRef.value) {
    curNode.value = unref(node)
    fileSelectorRef.value.openFileSelector()
  }
}

const fileSelectorChange = async (files: FileList) => {
  const backupData = await getBackupData(files)
  const total = files.length
  const success = importVideoSources(backupData, curNode.value.id)
  const fail = total - success
  messageApi[fail > 0 ? 'error' : 'success']({
    content: `${t('import')}${t('wordSplitSymbol')}${t('success')}: ${success}; ${t('fail')}: ${fail}`,
  })
}
</script>
