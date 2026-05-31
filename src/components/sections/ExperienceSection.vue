<script setup lang="ts">
import RevealOnScroll from '@/components/ui/RevealOnScroll.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useContent } from '@/composables/useContent'

const { experience } = useContent()

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
</script>

<template>
  <section
    id="experience"
    class="py-16 lg:py-24"
    aria-labelledby="experience-heading"
  >
    <div class="container mx-auto px-4 lg:px-8">
      <RevealOnScroll>
        <SectionHeading id="experience-heading" :title="experience.title" />
      </RevealOnScroll>
      <div class="mt-10 space-y-6">
        <RevealOnScroll
          v-for="(entry, index) in experience.entries"
          :key="`${entry.company}-${index}`"
        >
          <article class="surface-card p-6 lg:p-8">
            <div class="flex gap-4 lg:gap-6">
              <div
                class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white/5 lg:h-16 lg:w-16"
                aria-hidden="true"
              >
                <img
                  v-if="entry.logo"
                  :src="entry.logo"
                  :alt="`Logo ${entry.company}`"
                  class="h-full w-full object-contain p-2"
                />
                <span v-else class="font-display text-lg font-bold text-white/60">
                  {{ getInitials(entry.company) }}
                </span>
              </div>

              <div class="min-w-0 flex-1">
                <header>
                  <a
                    v-if="entry.companyUrl"
                    :href="entry.companyUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-display text-xl font-bold text-white transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                  >
                    {{ entry.company }}
                  </a>
                  <h3 v-else class="font-display text-xl font-bold text-white">
                    {{ entry.company }}
                  </h3>
                </header>

                <p class="mt-2 text-sm font-medium text-white">
                  {{ entry.role }}
                  <span class="text-muted"> · {{ entry.period }}</span>
                </p>
                <p v-if="entry.project" class="mt-1 text-sm text-muted">
                  <a
                    v-if="entry.projectUrl"
                    :href="entry.projectUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-medium text-white transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                  >
                    {{ entry.project }}
                  </a>
                  <span v-else>{{ entry.project }}</span>
                </p>
                <p class="mt-4 text-base leading-relaxed text-muted">{{ entry.summary }}</p>
                <ul
                  v-if="entry.highlights?.length"
                  class="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted"
                >
                  <li v-for="highlight in entry.highlights" :key="highlight">
                    {{ highlight }}
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </RevealOnScroll>
      </div>
    </div>
  </section>
</template>
