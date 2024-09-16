<template>
  <video ref="videoRef" class="h-full w-full" controls playsinline preload="none"></video>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import Hls from 'hls.js'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

const { source } = defineProps<{ source: string }>()

const videoRef = useTemplateRef<HTMLVideoElement>('videoRef')

const initPlayer = () => {
  if (!videoRef.value) return
  if (Hls.isSupported()) {
    const hls = new Hls()
    hls.on(Hls.Events.ERROR, (event, data) => {
      console.log('~~~~~!Hls.Events.ERROR', event, data)
    })

    hls.loadSource(source)
    hls.attachMedia(videoRef.value)
  } else if (videoRef.value.canPlayType('application/vnd.apple.mpegurl')) {
    videoRef.value.src = source
  }
  const player = new Plyr(videoRef.value)
  // videoRef.value.addEventListener('leavepictureinpicture', (...e) => {
  //   console.log('~~~~~!eee', e)
  // })
  // window.p = player
  // console.log('~~~~~!', player.pip)
}

onMounted(() => {
  initPlayer()
})
</script>
