<script setup lang="ts">
import { onSlideEnter, onSlideLeave } from '@slidev/client'
import { computed, nextTick, ref } from 'vue'

const props = defineProps<{
  src: string
  endTrimSeconds?: number
}>()

// Resolve absolute-path video URLs against the deployed base path so the
// build works both in dev (base = "/") and on GitHub Pages (base = "/wensli-slides/").
const resolvedSrc = computed(() => {
  const raw = props.src
  if (!raw) return raw
  if (/^(https?:)?\/\//.test(raw)) return raw
  if (raw.startsWith('/')) {
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
    return `${base}${raw}`
  }
  return raw
})

const videoRef = ref<HTMLVideoElement | null>(null)
const rafId = ref<number | null>(null)

const cancelEndGuard = () => {
  if (rafId.value !== null) {
    cancelAnimationFrame(rafId.value)
    rafId.value = null
  }
}

const getEndTrimSeconds = () => {
  return Math.max(props.endTrimSeconds ?? 0, 0)
}

const pauseAtTrimmedEnd = () => {
  const video = videoRef.value
  if (!video)
    return

  cancelEndGuard()
  video.pause()

  const trimSeconds = getEndTrimSeconds()
  if (trimSeconds > 0 && Number.isFinite(video.duration) && video.duration > trimSeconds) {
    video.currentTime = Math.max(video.duration - trimSeconds, 0)
  }
}

const guardVideoEnding = () => {
  const video = videoRef.value
  if (!video)
    return

  const trimSeconds = getEndTrimSeconds()
  if (trimSeconds <= 0) {
    cancelEndGuard()
    return
  }

  const tick = () => {
    const activeVideo = videoRef.value
    if (!activeVideo)
      return

    const duration = activeVideo.duration
    if (Number.isFinite(duration) && duration > trimSeconds) {
      const remaining = duration - activeVideo.currentTime
      if (remaining <= trimSeconds) {
        pauseAtTrimmedEnd()
        return
      }
    }

    rafId.value = requestAnimationFrame(tick)
  }

  cancelEndGuard()
  rafId.value = requestAnimationFrame(tick)
}

const playVideo = async () => {
  const video = videoRef.value
  if (!video)
    return

  cancelEndGuard()
  video.currentTime = 0
  video.muted = true
  try {
    await video.play()
    guardVideoEnding()
  } catch {
    // Autoplay can still be blocked in some browsers until first interaction.
  }
}

const pauseAndReset = () => {
  const video = videoRef.value
  if (!video)
    return

  cancelEndGuard()
  video.pause()
  video.currentTime = 0
}

onSlideEnter(async () => {
  await nextTick()
  await playVideo()
})

onSlideLeave(() => {
  pauseAndReset()
})
</script>

<template>
  <div class="training-video-frame">
    <video
      ref="videoRef"
      class="training-video"
      :src="resolvedSrc"
      preload="auto"
      muted
      autoplay
      playsinline
      webkit-playsinline="true"
      disablepictureinpicture
      @ended="pauseAtTrimmedEnd"
    />
  </div>
</template>

<style>
.training-video-frame {
  height: 100%;
  width: 100%;
  min-height: 100%;
  min-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-sizing: border-box;
  background: #000;
  overflow: hidden;
}

.training-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}
</style>
