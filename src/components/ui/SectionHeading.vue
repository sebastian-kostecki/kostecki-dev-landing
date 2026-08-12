<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    index?: string
    centered?: boolean
    headingId?: string
  }>(),
  {
    centered: false,
  },
)
</script>

<template>
  <div class="mb-12" :class="centered ? 'mx-auto max-w-2xl text-center' : ''">
    <div v-if="index" class="flex items-center gap-3" :class="centered ? 'justify-center' : ''">
      <span class="font-mono text-xs font-medium tracking-[0.3em] text-primary">{{ index }}</span>
      <span aria-hidden="true" class="rule-accent h-px w-16" />
    </div>
    <h2
      :id="headingId"
      class="mt-4 font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
    >
      {{ title }}
    </h2>
    <p
      v-if="subtitle"
      class="mt-4 text-base leading-relaxed text-muted-foreground"
      :class="centered ? '' : 'max-w-2xl'"
    >
      {{ subtitle }}
    </p>
  </div>
</template>
