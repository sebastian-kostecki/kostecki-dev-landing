<script setup lang="ts">
import { useContent } from '@/composables/useContent'

const content = useContent()
</script>

<template>
  <section class="panel rounded-md p-6 sm:p-8" aria-labelledby="summary-heading">
    <h2 id="summary-heading" class="font-mono text-xs tracking-[0.25em] text-primary uppercase">
      {{ content.summary.title }}
    </h2>
    <dl class="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-1">
      <div v-for="item in content.summary.items" :key="item.label" class="min-w-0">
        <dt class="font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
          {{ item.label }}
        </dt>
        <dd class="mt-1 text-[15px] leading-snug text-foreground">
          <a
            v-if="item.href"
            :href="item.href"
            class="text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
            >{{ item.value }}</a
          >
          <template v-else>{{ item.value }}</template>
        </dd>
      </div>
    </dl>
  </section>
</template>
