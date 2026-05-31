<script setup lang="ts">
import { useContent } from '@/composables/useContent'

const { hero, nav } = useContent()
</script>

<template>
  <section
    id="hero"
    class="relative flex min-h-screen flex-col overflow-hidden"
    aria-label="Hero"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(230,57,70,0.15)_0%,_transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.1)_0%,_transparent_50%)]"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.03]"
      style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')"
      aria-hidden="true"
    />

    <div
      class="container relative mx-auto flex flex-1 flex-col justify-between px-4 py-12 lg:px-8 lg:py-24"
    >
      <div class="flex flex-1 flex-col justify-center">
        <div class="max-w-3xl text-center lg:text-left">
          <h1 class="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
            <span class="text-gradient">{{ hero.name }}</span>
          </h1>
          <p class="mt-4 text-lg text-muted sm:text-xl lg:text-2xl">{{ hero.tagline }}</p>
          <p v-if="hero.subtitle" class="mt-3 text-base text-muted sm:text-lg lg:max-w-2xl">
            {{ hero.subtitle }}
          </p>
          <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <a
              :href="hero.ctaPrimary.href"
              class="btn-primary"
              :target="hero.ctaPrimary.href.startsWith('http') ? '_blank' : undefined"
              :rel="hero.ctaPrimary.href.startsWith('http') ? 'noopener noreferrer' : undefined"
            >
              {{ hero.ctaPrimary.label }}
            </a>
            <a
              :href="hero.ctaSecondary.href"
              class="btn-secondary"
              :target="hero.ctaSecondary.href.startsWith('http') ? '_blank' : undefined"
              :rel="hero.ctaSecondary.href.startsWith('http') ? 'noopener noreferrer' : undefined"
            >
              {{ hero.ctaSecondary.label }}
            </a>
          </div>
        </div>
      </div>

      <nav class="shrink-0 pt-10 lg:pt-12" aria-label="Główna nawigacja">
        <ul
          class="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6 lg:items-start lg:justify-start"
        >
          <li v-for="item in nav" :key="item.id">
            <a
              :href="`#${item.id}`"
              class="nav-link text-base font-medium text-white/80 hover:text-white"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>
