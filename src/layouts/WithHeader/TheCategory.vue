<template>
  <div class="ml-2 mt-2 box-border flex-1 overflow-y-auto pr-2">
    <TheLoading
      :loading="categoryStore.loading"
      :error="categoryStore.error"
      :data="categoryStore.data"
      :checkIsEmpty="() => !categoryStore.data?.length"
    >
      <NestedMenu v-model:open-keys="openKeys" :data="categoryStore.tree" itemKey="type_id">
        <template #default="{ item, level }">
          <div
            :class="{ active: item.type_id === categoryStore.curCategory }"
            class="flex cursor-pointer items-center rounded-lg py-1 pl-5 pr-3 text-gray-600 duration-100 hover:bg-slate-100 hover:text-black dark:bg-black dark:text-white [&.active]:bg-slate-200 [&.active]:text-black"
            @click="changeCurCategory(item.type_id)"
          >
            <div :style="{ width: `${level * 24}px` }"></div>
            <div class="flex-1">{{ item.type_name }}</div>
            <a-button
              v-if="item.children?.length"
              :class="{ open: openKeys.has(item.type_id) }"
              class="origin-center transition-transform duration-100 [&.open]:-scale-100"
              size="small"
              type="text"
              @click.stop="toggleOpen(item.type_id)"
            >
              <template #icon>
                <i class="iconfont icon-switcher text-xs font-bold"></i>
              </template>
            </a-button>
            <div v-if="item.children?.length" :class="{ open: openKeys.has(item.type_id) }"></div>
          </div>
        </template>
      </NestedMenu>
    </TheLoading>
  </div>
</template>

<script lang="ts" setup>
import useCategoryStore from '@/stores/category'
import NestedMenu from '@/components/NestedMenu.vue'
import TheLoading from '@/components/TheLoading.vue'
import { ref } from 'vue'
import useKeepQueryRouter from '@/hooks/useKeepQueryRouter'
import { useRoute } from 'vue-router'

const categoryStore = useCategoryStore()
const openKeys = ref(new Set<string | number>())
const router = useKeepQueryRouter()
const route = useRoute()

const toggleOpen = (id: string | number) => {
  if (openKeys.value.has(id)) {
    openKeys.value.delete(id)
  } else {
    openKeys.value.add(id)
  }
}
const changeCurCategory = (id: number) => {
  categoryStore.curCategory = id
  if (route.name !== 'videoList') {
    router.push({ name: 'videoList' })
  }
}
</script>
