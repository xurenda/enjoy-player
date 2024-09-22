<template>
  <a-select v-bind="$attrs" @dropdownVisibleChange="dropdownVisibleChange">
    <template #dropdownRender="{ menuNode: menu }">
      <v-nodes :vNodes="menu" />
      <div class="mt-2 box-border flex gap-y-2 border-t border-color-border p-2">
        <a-tag v-for="item in canDelValues" :key="item" closable @close="delValue(item)">
          {{ item }}
        </a-tag>
        <div>
          <a-input
            v-if="inputVisible"
            ref="inputRef"
            v-model:value="newValue"
            type="text"
            size="small"
            class="w-20"
            @blur="inputVisible = false"
            @keyup.enter="addNewValue"
          />
          <a-tag v-else class="flex cursor-pointer items-center border-dashed py-[1px]" @click="showInput">
            <i class="iconfont icon-add"></i>
            <span>{{ t('addItem') }}</span>
          </a-tag>
        </div>
      </div>
    </template>
  </a-select>
</template>

<script setup lang="ts">
import { computed, defineComponent, nextTick, ref, useAttrs, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

const { cannotDel = new Set() } = defineProps<{
  cannotDel?: Set<any>
}>()
const emit = defineEmits<{
  (e: 'add', value: string): void
  (e: 'del', value: any): void
}>()

const VNodes = defineComponent({
  props: {
    vNodes: {
      type: Object,
      required: true,
    },
  },
  render() {
    return this.vNodes
  },
})
const { t } = useI18n()
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const attrs = useAttrs()
const canDelValues = computed(() => {
  const options = attrs.options as any[]
  if (!options) {
    return []
  }
  return options.filter((option: any) => !cannotDel?.has(option.value)).map((option: any) => option.value)
})
const inputVisible = ref(false)
const newValue = ref('')

const showInput = (e: Event) => {
  e.stopPropagation()
  inputVisible.value = true
  nextTick(() => {
    inputRef.value?.focus()
    inputRef.value?.select()
  })
}

const addNewValue = () => {
  const val = newValue.value.trim()
  if (!val) {
    return
  }
  emit('add', val)
  newValue.value = ''
  inputVisible.value = false
}

const delValue = (value: any) => {
  emit('del', value)
}

const dropdownVisibleChange = (open: boolean) => {
  if (open) {
    inputVisible.value = false
  }
}
</script>
