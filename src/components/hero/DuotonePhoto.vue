<script setup lang="ts">
withDefaults(
  defineProps<{
    src?: string
    alt?: string
    placeholderLabel?: string
    shape?: 'portrait' | 'square'
  }>(),
  { shape: 'portrait' },
)
</script>

<template>
  <div
    class="duotone relative overflow-hidden rounded-sm border border-border bg-[#141416]"
    :class="shape === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'"
  >
    <img
      v-if="src"
      :src="src"
      :alt="alt ?? ''"
      class="duotone-img h-full w-full object-cover"
      loading="eager"
    />
    <svg
      v-else
      viewBox="0 0 300 400"
      :preserveAspectRatio="shape === 'square' ? 'xMidYMid slice' : 'xMidYMax slice'"
      class="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="duo-ph" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#3a1418" />
          <stop offset="1" stop-color="#e63946" stop-opacity="0.55" />
        </linearGradient>
      </defs>
      <ellipse cx="150" cy="150" rx="62" ry="72" fill="url(#duo-ph)" />
      <path d="M30 400c0-90 50-150 120-150s120 60 120 150z" fill="url(#duo-ph)" />
    </svg>
    <span aria-hidden="true" class="duotone-tint absolute inset-0" />
    <span aria-hidden="true" class="duotone-scan absolute inset-0" />
    <span
      v-if="!src && placeholderLabel && shape === 'portrait'"
      class="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-sm border border-dashed border-foreground/25 bg-background/60 px-2 py-1 font-mono text-[10px] tracking-[0.15em] whitespace-nowrap text-muted-foreground uppercase"
    >
      {{ placeholderLabel }}
    </span>
  </div>
</template>
