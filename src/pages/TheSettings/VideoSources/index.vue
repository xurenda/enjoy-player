<template>
  <div>
    <!-- {{ videoSources }}@@@@
    {{ runtimeVideoSources }} -->
    <Draggable
      v-model="videoSources.runtimeVideoSources"
      treeLine
      textKey="name"
      :eachDroppable="eachDroppable"
      :nodeKey="stat => stat.data.key"
    >
      <template #default="{ node, stat }">
        <!-- <OpenIcon
        v-if="stat.children.length"
        :open="stat.open"
        class="mtl-mr"
        @click.native="stat.open = !stat.open"
      /> -->
        <!-- <input
        class="mtl-checkbox mtl-mr"
        type="checkbox"
        v-model="stat.checked"
      /> -->
        <div class="flex items-center justify-between">
          <div>{{ node.name }}</div>
          <div>
            <a-tooltip>
              <template #title>{{ t('add') }}</template>
              <a-button type="text" @click="openModal('add', node)">
                <template #icon>
                  <i class="iconfont icon-add"></i>
                </template>
              </a-button>
            </a-tooltip>
          </div>
        </div>
      </template>
    </Draggable>
    <SourcesModal v-model:open="open" :type="modalType" :node="modalNode" />
  </div>
</template>

<script setup lang="ts">
import { useVideoSourcesStore } from '@/stores/videoSources'
import { Draggable, type PropDroppable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import { useI18n } from 'vue-i18n'
import SourcesModal, { type SourcesModalProps } from './SourcesModal.vue'
import { ref, unref } from 'vue'

defineOptions({
  name: 'VideoSources',
})

const { t } = useI18n()

const eachDroppable: PropDroppable = node => {
  console.log('~~~~~!n', node)
  return true
}

const videoSources = useVideoSourcesStore()
const { treeRoot } = videoSources
const open = ref(false)
const modalType = ref<SourcesModalProps['type']>('add')
const modalNode = ref<SourcesModalProps['node']>(treeRoot)

const openModal = (type: SourcesModalProps['type'], node: SourcesModalProps['node']) => {
  modalType.value = type
  modalNode.value = unref(node)
  open.value = true
}
</script>
