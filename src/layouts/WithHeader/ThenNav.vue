<template>
  <div
    class="ba box-border h-full w-1/6 overflow-hidden border-r border-b-neutral-300 bg-white transition-all"
    :style="{ width: props.isShow ? '277px' : '0px' }"
  >
    <div class="w-full" v-for="(item, index) in list" :key="item.value">
      <div class="cursor-pointer border-b border-b-neutral-300 py-2 pl-1 hover:bg-gray-600 hover:text-sky-400">
        <i
          class="iconfont icon-switcher-right inline-block rotate-90"
          :style="{ transform: list[index].isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }"
          @click="isShowOpen(index)"
        ></i>
        {{ item.title }}
      </div>
      <div
        class="overflow-hidden transition-all"
        :style="{ height: list[index].isOpen ? `${item.inner.length * 41}px` : `0px` }"
      >
        <div
          class="box-border w-full cursor-pointer border-b border-b-neutral-300 py-2 pl-6 hover:bg-gray-600 hover:text-sky-400"
          v-for="i in item.inner"
          :key="i"
        >
          {{ i }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
defineOptions({ name: 'TheList' })
const props = defineProps<{
  isShow: boolean
}>()
const list = ref([
  { title: '电影', value: 0, inner: ['a电影', 'b电影', 'c电影', 'd电影'], isOpen: true },
  { title: '奇幻', value: 1, inner: ['a电影', 'b电影', 'c电影', 'd电影'], isOpen: true },
  { title: '科幻', value: 2, inner: ['a电影', 'b电影', 'c电影', 'd电影'], isOpen: true },
  { title: '喜剧', value: 3, inner: ['a电影', 'b电影', 'c电影', 'd电影'], isOpen: true },
])
function isShowOpen(index: number) {
  list.value[index].isOpen = !list.value[index].isOpen
}
</script>
