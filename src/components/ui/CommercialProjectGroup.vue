<script setup lang="ts">
import CommercialProjectItem from '@/components/ui/CommercialProjectItem.vue'
import type { CommercialProjectGroup } from '@/types/content'

withDefaults(
  defineProps<{
    group: CommercialProjectGroup
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)

function itemIndex(index: number) {
  return String(index + 1).padStart(2, '0')
}
</script>

<template>
  <section class="panel rounded-md p-6 sm:p-8">
    <p class="font-mono text-xs tracking-[0.25em] text-primary uppercase">
      {{ group.eyebrow }}
    </p>

    <div class="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div class="max-w-2xl">
        <h3 class="font-mono text-xl font-bold text-card-foreground sm:text-2xl">
          {{ group.title }}
        </h3>
        <div
          v-if="!compact"
          class="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground"
        >
          <span>{{ group.context.employer }}</span>
          <span aria-hidden="true" class="text-primary">/</span>
          <span>{{ group.context.role }}</span>
          <span aria-hidden="true" class="text-primary">/</span>
          <span>{{ group.context.period }}</span>
        </div>
        <p class="mt-4 leading-relaxed text-muted-foreground">{{ group.description }}</p>
        <p class="mt-4 text-sm font-medium text-foreground">{{ group.authorship }}</p>
      </div>

      <div v-if="compact" class="shrink-0 border-l-2 border-primary pl-4">
        <p class="font-mono text-3xl font-bold text-primary">{{ group.items.length }}</p>
        <p class="mt-1 max-w-52 text-sm text-muted-foreground">{{ group.compactLabel }}</p>
      </div>
    </div>

    <div class="mt-6 flex flex-wrap gap-2">
      <span
        v-for="tag in group.tags"
        :key="tag"
        class="rounded-sm border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[11px] text-secondary-foreground"
      >
        {{ tag }}
      </span>
    </div>

    <div v-if="!compact" class="mt-7 grid gap-3 md:grid-cols-2">
      <CommercialProjectItem
        v-for="(item, index) in group.items"
        :key="item.title"
        :item="item"
        :index="itemIndex(index)"
      />
    </div>
  </section>
</template>
