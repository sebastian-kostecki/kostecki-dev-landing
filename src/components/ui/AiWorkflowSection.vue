<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'
import { computed } from 'vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useContent } from '@/composables/useContent'
import { useLocale } from '@/composables/useLocale'
import { archiveFolderLabel } from '@/content/archive-proof'
import archive from '@/generated/archive.json'

const content = useContent()
const { locale } = useLocale()

const archiveTotal = computed(() =>
  new Intl.NumberFormat(locale.value === 'pl' ? 'pl-PL' : 'en-US').format(archive.total),
)

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

      <div class="mb-12">
        <p class="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {{ content.aiWorkflow.proof.lead }}
        </p>

        <ul class="mt-6 grid gap-4 md:grid-cols-2">
          <li
            v-for="item in content.aiWorkflow.proof.items"
            :key="item.url"
            class="panel rounded-md p-5"
          >
            <a
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 break-all font-mono text-xs font-medium text-primary transition-colors hover:text-primary-glow"
            >
              {{ item.project }} / {{ archiveFolderLabel(item.url) }}
              <ArrowUpRight class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </a>
            <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{{ item.shows }}</p>
          </li>
        </ul>

        <div class="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span class="font-mono text-4xl font-semibold text-foreground">{{ archiveTotal }}</span>
          <span class="text-sm text-muted-foreground">
            {{ content.aiWorkflow.proof.counterLabel }}
          </span>
          <a
            v-for="link in content.aiWorkflow.proof.archiveLinks"
            :key="link.url"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-primary transition-colors hover:text-primary-glow"
          >
            {{ link.title }}
            <ArrowUpRight class="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>

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
