<script setup lang="ts">
import { ref } from 'vue'
import RevealOnScroll from '@/components/ui/RevealOnScroll.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useContent } from '@/composables/useContent'

const content = useContent()

// Track which entries have highlights expanded (keyed by index). First entry open by default.
const expanded = ref<Record<number, boolean>>({ 0: true })

function toggle(index: number) {
  expanded.value[index] = !expanded.value[index]
}

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
  <section id="experience" class="bg-surface py-20 lg:py-28" aria-labelledby="experience-heading">
    <div class="container mx-auto px-4 lg:px-8">
      <RevealOnScroll>
        <SectionHeading
          id="experience-heading"
          :command="content.experience.command"
          :title="content.experience.title"
        />
      </RevealOnScroll>

      <div class="mt-12 space-y-6 border-l border-border pl-6 lg:pl-8">
        <RevealOnScroll
          v-for="(entry, index) in content.experience.entries"
          :key="`${entry.company}-${index}`"
        >
          <article class="relative surface-card p-6 lg:p-8">
            <span
              class="absolute -left-[1.85rem] top-8 h-3 w-3 rounded-full border-2 border-bg bg-accent lg:-left-[2.35rem]"
              aria-hidden="true"
            />
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
                  <h3 v-else class="font-display text-xl font-bold text-white">{{ entry.company }}</h3>
                </header>
                <p class="mt-2 font-mono text-sm font-medium text-white">
                  {{ entry.role }}<span class="text-muted"> · {{ entry.period }}</span>
                </p>
                <p v-if="entry.project" class="mt-1 text-sm text-muted">{{ entry.project }}</p>
                <p class="mt-4 text-base leading-relaxed text-muted">{{ entry.summary }}</p>

                <template v-if="entry.highlights?.length">
                  <button
                    type="button"
                    class="mt-4 inline-flex items-center gap-2 font-mono text-xs font-semibold text-accent transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                    :aria-expanded="!!expanded[index]"
                    :aria-controls="`exp-highlights-${index}`"
                    @click="toggle(index)"
                  >
                    {{ expanded[index] ? content.ui.collapse : content.ui.expand }}
                    <span aria-hidden="true">{{ expanded[index] ? '−' : '+' }}</span>
                  </button>
                  <ul
                    v-show="expanded[index]"
                    :id="`exp-highlights-${index}`"
                    class="mt-4 space-y-2 text-sm leading-relaxed text-muted"
                  >
                    <li
                      v-for="highlight in entry.highlights"
                      :key="highlight"
                      class="border-l-2 border-accent/60 pl-3"
                    >
                      {{ highlight }}
                    </li>
                  </ul>
                </template>
              </div>
            </div>
          </article>
        </RevealOnScroll>
      </div>
    </div>
  </section>
</template>
