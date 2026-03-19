<template>
  <span class="inline-flex items-center">
    <span class="truncate">{{ displayText }}</span>
    <span class="ml-0.5 inline-block w-[1ch] animate-pulse" aria-hidden="true">|</span>
  </span>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface Props {
  phrases: string[]
  typeSpeed?: number
  deleteSpeed?: number
  holdAfterType?: number
  holdAfterDelete?: number
}

const props = withDefaults(defineProps<Props>(), {
  typeSpeed: 70,
  deleteSpeed: 40,
  holdAfterType: 1400,
  holdAfterDelete: 350,
})

const displayText = ref('')
const phraseIndex = ref(0)
const charIndex = ref(0)
const isDeleting = ref(false)

let timer: ReturnType<typeof setTimeout> | null = null

function schedule(delay: number) {
  timer = setTimeout(step, delay)
}

function step() {
  if (props.phrases.length === 0) {
    displayText.value = ''
    return
  }

  const currentPhrase = props.phrases[phraseIndex.value] ?? ''

  if (!isDeleting.value) {
    charIndex.value += 1
    displayText.value = currentPhrase.slice(0, charIndex.value)

    if (charIndex.value >= currentPhrase.length) {
      isDeleting.value = true
      schedule(props.holdAfterType)
      return
    }

    schedule(props.typeSpeed)
    return
  }

  charIndex.value -= 1
  displayText.value = currentPhrase.slice(0, Math.max(charIndex.value, 0))

  if (charIndex.value <= 0) {
    isDeleting.value = false
    phraseIndex.value = (phraseIndex.value + 1) % props.phrases.length
    schedule(props.holdAfterDelete)
    return
  }

  schedule(props.deleteSpeed)
}

onMounted(() => {
  if (props.phrases.length > 0) {
    schedule(300)
  }
})

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>
