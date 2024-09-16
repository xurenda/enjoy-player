<template>
  <div class="group border-transparent" :class="classNames.parent" @mousedown="startResize">
    <div :class="classNames.child"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

interface Props {
  direction?: 'horizontal' | 'vertical' // 拖拽方向
  disabled?: boolean
}

const { direction = 'vertical', disabled = false } = defineProps<Props>()
const resizeSize = defineModel<number>('resizeSize', { required: true })

const classNames = computed(() => {
  const isVertical = direction === 'vertical'
  const parent = [
    ...(isVertical ? ['h-full', 'border-x'] : ['w-full', 'border-y']),
    ...(disabled ? [] : ['hover:border-slate-300']),
  ]
  if (!disabled) {
    parent.push(isVertical ? 'cursor-col-resize' : 'cursor-row-resize')
  }
  const child = [
    ...(isVertical ? ['h-full', 'border-l'] : ['w-full', 'border-t']),
    ...(disabled ? [] : ['group-hover:border-slate-300']),
  ]
  return {
    parent,
    child,
  }
})

const isResizing = ref<boolean>(false)
const start = ref<number>(0) // 拖拽距离

// 鼠标按下触发
const startResize = (event: MouseEvent) => {
  if (disabled) return
  isResizing.value = true
  start.value = direction === 'vertical' ? event.clientX : event.clientY // 开始位置
  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', stopResize)
}

// 鼠标移动监控函数
const resize = (event: MouseEvent) => {
  if (isResizing.value) {
    const delta = (direction === 'vertical' ? event.clientX : event.clientY) - start.value
    resizeSize.value += delta
    start.value = direction === 'vertical' ? event.clientX : event.clientY
  }
}

// 注销监听鼠标事件函数
const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResize)
}
</script>
