<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useContent } from '@/composables/useContent'

const content = useContent()

function stepIndex(index: number) {
  return String(index + 1).padStart(2, '0')
}
</script>

<template>
  <section class="px-4 py-24 sm:px-6 lg:px-8" aria-labelledby="ai-workflow-heading">
    <div class="mx-auto max-w-6xl">
      <SectionHeading
        heading-id="ai-workflow-heading"
        :index="content.aiWorkflow.index"
        :title="content.aiWorkflow.title"
        :subtitle="content.aiWorkflow.subtitle"
      />

      <ol class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <li
          v-for="(step, i) in content.aiWorkflow.steps"
          :key="step.title"
          class="panel flex flex-col rounded-md p-5"
        >
          <span class="font-mono text-xs tracking-[0.2em] text-primary">{{ stepIndex(i) }}</span>
          <h3 class="mt-3 font-mono text-base font-semibold text-card-foreground">
            {{ step.title }}
          </h3>
          <p class="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{{ step.body }}</p>
          <a
            v-if="step.link"
            :href="step.link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-medium text-primary transition-colors hover:text-primary-glow"
          >
            {{ step.link.title }}
            <ArrowUpRight class="h-3.5 w-3.5" />
          </a>
        </li>
      </ol>

      <p class="mt-8 max-w-3xl font-mono text-sm leading-relaxed text-foreground">
        {{ content.aiWorkflow.closing }}
      </p>
    </div>
  </section>
</template>
