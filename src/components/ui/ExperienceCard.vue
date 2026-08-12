<script setup lang="ts">
withDefaults(
  defineProps<{
    company: string
    role: string
    period: string
    summary: string
    highlights?: string[]
    index?: string
    companyUrl?: string
  }>(),
  {
    highlights: () => [],
  },
)
</script>

<template>
  <article class="relative pl-8">
    <span aria-hidden="true" class="absolute top-2 left-0 h-2 w-2 rounded-full bg-primary" />
    <span
      aria-hidden="true"
      class="absolute top-6 left-[3px] h-[calc(100%-1rem)] w-px bg-border"
    />

    <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span v-if="index" class="font-mono text-xs tracking-[0.2em] text-primary">{{ index }}</span>
      <h3 class="font-mono text-xl font-semibold text-foreground">
        <a
          v-if="companyUrl"
          :href="companyUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="transition-colors hover:text-primary"
        >
          {{ company }}
        </a>
        <template v-else>{{ company }}</template>
      </h3>
      <span class="font-mono text-xs text-muted-foreground">/ {{ period }}</span>
    </div>
    <p class="mt-1 text-sm font-medium text-primary">{{ role }}</p>
    <p class="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{{ summary }}</p>

    <ul v-if="highlights.length" class="mt-5 grid gap-2 sm:grid-cols-2">
      <li
        v-for="item in highlights"
        :key="item"
        class="panel rounded-md px-4 py-3 text-sm leading-relaxed text-muted-foreground"
      >
        {{ item }}
      </li>
    </ul>
  </article>
</template>
