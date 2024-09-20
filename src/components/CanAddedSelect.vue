<template>
  <a-select v-bind="$attrs">
    <template #dropdownRender="{ menuNode: menu }">
      <v-nodes :vNodes="menu" />
      <a-divider class="my-2" />
      <a-form>
        <a-form-item v-bind="validateInfos.newValue">
          <a-input v-model:value="data.newValue" :placeholder="t('addItem')" @keyup.enter="addNewValue" />
        </a-form-item>
      </a-form>
    </template>
  </a-select>
</template>

<script setup lang="ts">
import { Form } from 'ant-design-vue'
import { defineComponent, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const { newValueRules = [] } = defineProps<{
  newValueRules?: any[]
}>()
const emit = defineEmits<{
  (e: 'add', value: string): void
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

const data = reactive({
  newValue: '',
})
const rules = reactive({
  newValue: newValueRules,
})

const { validate, validateInfos } = Form.useForm(data, rules)

const addNewValue = () => {
  validate().then(() => {
    emit('add', data.newValue)
    data.newValue = ''
  })
}
</script>
