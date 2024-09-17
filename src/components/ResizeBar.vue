<template>
  <div class="flex h-full w-full" :class="direction === 'row' ? 'flex-row' : 'flex-col'">
    <div ref="firstRef" :class="firstClass" :style="firstSecondStyle.first">
      <slot name="first" />
    </div>
    <div
      ref="resizeBarRef"
      class="relative before:absolute before:border-transparent"
      :class="resizeBarClass"
      @mousedown="startResize"
    ></div>
    <div ref="secondRef" :class="secondClass" :style="firstSecondStyle.second">
      <slot name="second" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, useTemplateRef, type StyleValue } from 'vue'

defineOptions({ name: 'ResizeBar' })

export interface ResizeBarProps {
  direction?: 'row' | 'column' // 拖拽方向，row 横向，column 纵向
  bindOn?: 'first' | 'second' // 尺寸绑定到哪个元素
  disabled?: boolean
  firstClass?: string
  secondClass?: string
}

const {
  direction = 'row',
  bindOn = 'first',
  disabled = false,
  firstClass = '',
  secondClass = '',
} = defineProps<ResizeBarProps>()
const resizeSize = defineModel<number>('resizeSize', { required: true })
const resizeBarRef = useTemplateRef<HTMLDivElement>('resizeBarRef')
const firstRef = useTemplateRef<HTMLDivElement>('firstRef')
const secondRef = useTemplateRef<HTMLDivElement>('secondRef')

let isResizing = ref(false)
let distance = 0 // 拖拽距离

const firstSecondStyle = computed(() => {
  let first: StyleValue
  let second: StyleValue
  const flex1: StyleValue = { flex: 1 }
  const resize: StyleValue =
    direction === 'row' ? { width: `${resizeSize.value}px` } : { height: `${resizeSize.value}px` }
  if (isResizing.value) {
    resize.transitionDuration = '0s'
    resize.pointerEvents = 'none'
    flex1.pointerEvents = 'none'
    resize.userSelect = 'none'
    flex1.userSelect = 'none'
  }
  if (bindOn === 'first') {
    first = resize
    second = flex1
  } else {
    first = flex1
    second = resize
  }

  return { first, second }
})

const resizeBarClass = computed(() => {
  let classes =
    direction === 'row'
      ? 'h-full w-0 border-l before:bottom-0 before:left-[-2px] before:top-0 before:border-l before:border-r-2'
      : 'h-0 w-full border-t before:left-0 before:right-0 before:top-[-2px] before:border-b-2 before:border-t'

  if (!disabled) {
    classes += ' before:hover:border-slate-500 before:[&.active]:border-slate-500'
    classes +=
      direction === 'row' ? ' cursor-ew-resize before:cursor-ew-resize' : ' cursor-ns-resize before:cursor-ns-resize'
  }

  return classes
})

// 鼠标按下触发
const startResize = (event: MouseEvent) => {
  if (disabled) return
  isResizing.value = true
  resizeBarRef.value?.classList.add('active')
  document.body.style.cursor = direction === 'row' ? 'ew-resize' : 'ns-resize'
  distance = direction === 'row' ? event.clientX : event.clientY
  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', stopResize)
}

// 鼠标移动监控函数
const resize = (event: MouseEvent) => {
  if (isResizing.value) {
    const client = direction === 'row' ? event.clientX : event.clientY
    const delta = client - distance
    resizeSize.value += bindOn === 'first' ? delta : -delta
    distance = client
  }
}

// 注销监听鼠标事件函数
const stopResize = () => {
  isResizing.value = false
  resizeBarRef.value?.classList.remove('active')
  document.body.style.cursor = 'default'
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResize)
}
</script>
