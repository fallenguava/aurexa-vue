<template>
  <div
    class="inline-flex items-center gap-[0.45em] align-middle text-amber-500"
    role="status"
    aria-live="polite"
    :aria-label="text"
  >
    <span v-if="variant === 'sandclock'" class="sandclock-wrap" aria-hidden="true">
      <svg class="sandclock-svg" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- top + bottom bars -->
        <path d="M2 1h14M2 21h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />

        <!-- ghost outline of both cones -->
        <path d="M3 1C3 1 5 8 9 11C13 8 15 1 15 1Z" fill="currentColor" opacity=".14" />
        <path d="M3 21C3 21 5 14 9 11C13 14 15 21 15 21Z" fill="currentColor" opacity=".14" />
        <path
          d="M3 1C3 1 5 8 9 11C13 8 15 1 15 1Z"
          stroke="currentColor"
          stroke-width="1"
          stroke-linejoin="round"
          fill="none"
        />
        <path
          d="M3 21C3 21 5 14 9 11C13 14 15 21 15 21Z"
          stroke="currentColor"
          stroke-width="1"
          stroke-linejoin="round"
          fill="none"
        />

        <!-- clip paths for sand fill -->
        <clipPath id="sc-top-clip">
          <path d="M3.5 1.8C3.5 1.8 5.5 7.8 9 10.6C12.5 7.8 14.5 1.8 14.5 1.8Z" />
        </clipPath>
        <clipPath id="sc-bot-clip">
          <path d="M3.5 20.2C3.5 20.2 5.5 14.2 9 11.4C12.5 14.2 14.5 20.2 14.5 20.2Z" />
        </clipPath>

        <!-- sand in top cone (drains away) -->
        <rect
          class="sand-top"
          x="3.5"
          y="2"
          width="11"
          height="8.4"
          fill="currentColor"
          opacity=".85"
          clip-path="url(#sc-top-clip)"
        />

        <!-- sand in bottom cone (fills up) -->
        <rect
          class="sand-bottom"
          x="3.5"
          y="12"
          width="11"
          height="8.2"
          fill="currentColor"
          opacity=".85"
          clip-path="url(#sc-bot-clip)"
        />

        <!-- falling grain thread -->
        <line
          class="sand-fall"
          x1="9"
          y1="10.5"
          x2="9"
          y2="11.6"
          stroke="currentColor"
          stroke-width="1.2"
          stroke-linecap="round"
        />
      </svg>
    </span>

    <span v-else-if="variant === 'spinner'" class="loading-spinner" aria-hidden="true" />

    <span v-else class="loading-dots" aria-hidden="true"> <span /><span /><span /> </span>

    <span v-if="showText" class="text-[0.82em] font-medium tracking-wide text-zinc-400">
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'sandclock' | 'spinner' | 'dots'
    text?: string
    showText?: boolean
  }>(),
  {
    variant: 'sandclock',
    text: 'Loading...',
    showText: true,
  },
)
</script>

<style scoped>
/* ── Sandclock SVG wrapper ──────────────────── */
.sandclock-wrap {
  display: inline-flex;
  align-items: center;
}

.sandclock-svg {
  width: 0.9em;
  height: 1.1em;
  overflow: visible;
  animation: sc-flip 2.4s ease-in-out infinite;
  transform-origin: center;
}

.sand-top {
  transform-origin: bottom center;
  animation: sc-sand-top 2.4s ease-in-out infinite;
}

.sand-bottom {
  transform-origin: top center;
  animation: sc-sand-bottom 2.4s ease-in-out infinite;
}

.sand-fall {
  animation: sc-fall 2.4s ease-in-out infinite;
}

/* ── Spinner ────────────────────────────────── */
.loading-spinner {
  width: 1em;
  height: 1em;
  border-radius: 9999px;
  border: 0.13em solid color-mix(in srgb, currentColor 18%, transparent);
  border-top-color: currentColor;
  animation: spin 0.8s linear infinite;
}

/* ── Dots ───────────────────────────────────── */
.loading-dots {
  display: inline-flex;
  align-items: center;
  gap: 0.22em;
}

.loading-dots > span {
  width: 0.26em;
  height: 0.26em;
  background: currentColor;
  border-radius: 9999px;
  animation: bounce 1s ease-in-out infinite;
}

.loading-dots > span:nth-child(2) {
  animation-delay: 0.13s;
}
.loading-dots > span:nth-child(3) {
  animation-delay: 0.26s;
}

/* ── Keyframes ──────────────────────────────── */
@keyframes sc-flip {
  0%,
  40% {
    transform: rotate(0deg);
  }
  50%,
  90% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes sc-sand-top {
  0% {
    transform: scaleY(1);
    opacity: 0.85;
  }
  38% {
    transform: scaleY(0);
    opacity: 0;
  }
  50% {
    transform: scaleY(0);
    opacity: 0;
  }
  52% {
    transform: scaleY(1);
    opacity: 0.85;
  }
  100% {
    transform: scaleY(1);
    opacity: 0.85;
  }
}

@keyframes sc-sand-bottom {
  0% {
    transform: scaleY(0);
    opacity: 0;
  }
  38% {
    transform: scaleY(1);
    opacity: 0.85;
  }
  50% {
    transform: scaleY(1);
    opacity: 0.85;
  }
  52% {
    transform: scaleY(0);
    opacity: 0;
  }
  100% {
    transform: scaleY(0);
    opacity: 0;
  }
}

@keyframes sc-fall {
  0%,
  5% {
    opacity: 1;
    transform: translateY(0px);
  }
  35% {
    opacity: 1;
    transform: translateY(7px);
  }
  40% {
    opacity: 0;
    transform: translateY(8px);
  }
  50% {
    opacity: 0;
    transform: translateY(0px);
  }
  52% {
    opacity: 1;
    transform: translateY(0px);
  }
  88% {
    opacity: 1;
    transform: translateY(7px);
  }
  92% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 0;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.38;
  }
  40% {
    transform: translateY(-0.2em);
    opacity: 1;
  }
}
</style>
