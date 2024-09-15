<template>
  <a-modal
    centered
    destroyOnClose
    v-model:open="open"
    :title="t(type)"
    :cancelText="t('cancel')"
    :okText="t('ok')"
    @ok="handleOk"
  >
    <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <a-form-item :label="t('type')" v-bind="validateInfos.type">
        <a-select :disabled="type === 'edit'" v-model:value="data.type">
          <a-select-option v-for="item in vsNodeTypes" :key="item" :value="item">{{ t(item) }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="t('name')" v-bind="validateInfos.name">
        <a-input v-model:value="data.name" />
      </a-form-item>
      <a-form-item v-if="data.type === 'source'" :label="t('api')" v-bind="validateInfos.api">
        <a-input v-model:value="data.api" />
      </a-form-item>
      <a-form-item :label="t('remark')" v-bind="validateInfos.remark">
        <a-textarea v-model:value="data.remark" :autoSize="{ minRows: 6, maxRows: 6 }" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import type { RVSNode, VSNode } from '@/stores/videoSources'
import { Form } from 'ant-design-vue'
import { reactive, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVideoSourcesStore, vsNodeTypes } from '@/stores/videoSources'

export interface SourcesModalProps {
  type: 'add' | 'edit'
  node: RVSNode
}

const open = defineModel<boolean>('open')
const { type, node } = defineProps<SourcesModalProps>()

const { t } = useI18n()
const { addNode} = useVideoSourcesStore()

const data = reactive<Partial<VSNode>>({
  type: 'source',
  name: '',
  api: '',
  remark: '',
})

const rules = reactive({
  type: [
    {
      required: true,
      message: t('validate.requiredField'),
    },
  ],
  name: [
    {
      required: true,
      message: t('validate.requiredField'),
    },
  ],
  api: [
    {
      async validator(_: unknown, value: string) {
        if (data.type !== 'source') {
          return
        }
        if (!value) {
          throw new Error(t('validate.requiredField'))
        }
        if (!/^https?:\/\/.+$/i.test(value)) {
          throw new Error(t('validate.url'))
        }
      },
    },
  ],
})

const { validate, validateInfos } = Form.useForm(data, rules)

watchEffect(() => {
  switch (type) {
    case 'add':
      data.type = 'source'
      data.name = ''
      data.api = ''
      data.remark = ''
      break
    case 'edit':
      data.type = node.type
      data.name = node.name
      data.api = node.api
      data.remark = node.remark
      break
  }
})

const handleOk = async () => {
  try {
    const values = await validate()
    switch (type) {
      case 'add':
        addNode(node.id, values)
        break
      case 'edit':
        break
    }
    open.value = false
  } catch (error) {
    // ignore
  }
}
</script>
