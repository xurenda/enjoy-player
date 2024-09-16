<template>
  <div v-for="item in data" :key="item[itemKey]">
    <slot :item="item" :level="level"></slot>
    <div v-if="item[childrenKey]?.length && openKeys.has(item[itemKey])">
      <NestedMenu
        v-model:open-keys="openKeys"
        :data="item[childrenKey]"
        :item-key="itemKey"
        :children-key="childrenKey"
        :level="level + 1"
      >
        <template #default="{ item, level }"><slot :item="item" :level="level"></slot></template>
      </NestedMenu>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends { [key: string]: any }">
const {
  data,
  itemKey = 'key',
  childrenKey = 'children',
  level = 0,
} = defineProps<{
  data: T[]
  itemKey?: string
  childrenKey?: string
  level?: number
}>()

defineSlots<{
  default: (data: { item: T; level: number }) => any
}>()

const openKeys = defineModel<Set<string | number>>('openKeys', { required: true })
</script>
