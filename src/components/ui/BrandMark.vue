<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number
    decorative?: boolean
  }>(),
  {
    size: 32,
    decorative: true,
  },
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    :role="decorative ? undefined : 'img'"
    :aria-hidden="decorative ? 'true' : undefined"
    :aria-label="decorative ? undefined : 'Sebastian Kostecki'"
    class="shrink-0"
  >
    <rect
      width="32"
      height="32"
      rx="6"
      fill="#0c0c0e"
      stroke="#ffffff"
      stroke-opacity="0.18"
      stroke-width="1"
    />
    <path
      d="M7 5 L25 27 M25 5 L7 27"
      fill="none"
      stroke="#e63946"
      stroke-width="3.5"
      stroke-linecap="round"
    />
    <circle cx="16" cy="16" r="2.5" fill="#ffffff" />
  </svg>
</template>
