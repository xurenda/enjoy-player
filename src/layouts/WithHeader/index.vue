<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <TheHeader @is-show-list="isShowList" />
    <div class="flex-1">
      <ThenNav :isShow="isShow" />
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TheHeader from './TheHeader.vue'
import ThenNav from './ThenNav.vue'
defineOptions({
  name: 'WithHeader',
})
const isShow = ref(false)
function isShowList() {
  isShow.value = !isShow.value
}
</script>
