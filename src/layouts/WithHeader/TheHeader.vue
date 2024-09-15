<template>
  <div class="flex items-center justify-between bg-slate-100 px-6 py-3">
    <a-button @click="emit('isShowList')">
      <template #icon>
        <i class="iconfont icon-menu"></i>
      </template>
    </a-button>

    <a-input class="w-96" v-model:value="keyword">
      <template #prefix><i class="iconfont icon-search"></i></template>
    </a-input>

    <a-tooltip :#title="t('settings')">
      <a-button @click="router.push('/settings')">
        <template #icon>
          <i class="iconfont icon-settings"></i>
        </template>
      </a-button>
    </a-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const emit = defineEmits<{
  (e: 'isShowList'): void
}>()

const { t } = useI18n()
const router = useRouter()

const keyword = ref('')
</script>
