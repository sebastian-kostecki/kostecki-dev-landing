<script setup lang="ts">
import { computed } from 'vue'
import MetricBar from '@/components/ui/MetricBar.vue'
import { useContent } from '@/composables/useContent'

const content = useContent()
const hasCv = computed(() => content.value.cv.href.length > 0)
</script>

<template>
  <section
    id="hero"
    class="relative flex min-h-screen flex-col overflow-hidden"
    aria-label="Hero"
  >
    <div
      class="pointer-events-none absolute inset-0 blueprint-grid opacity-60"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(230,57,70,0.16)_0%,_transparent_55%)]"
      aria-hidden="true"
    />

    <div class="container relative mx-auto flex flex-1 flex-col justify-center px-4 py-24 lg:px-8">
      <div class="max-w-3xl">
        <p class="cmd-label">{{ content.hero.label }}</p>
        <h1 class="mt-4 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl">
          {{ content.hero.name }}
        </h1>
        <p class="mt-5 max-w-2xl font-display text-xl font-semibold text-white/90 sm:text-2xl">
          {{ content.hero.valueProp }}
        </p>
        <p v-if="content.hero.subtitle" class="mt-4 max-w-2xl text-base text-muted sm:text-lg">
          {{ content.hero.subtitle }}
        </p>

        <div class="mt-8 flex flex-col gap-4 sm:flex-row">
          <a
            :href="content.hero.ctaPrimary.href"
            class="btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ content.hero.ctaPrimary.label }}
          </a>
          <a
            v-if="hasCv"
            :href="content.cv.href"
            class="btn-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ content.ui.downloadCv }}
          </a>
        </div>

        <div class="mt-12 border-t border-border pt-8">
          <MetricBar :metrics="content.hero.metrics" />
        </div>
      </div>
    </div>
  </section>
</template>
