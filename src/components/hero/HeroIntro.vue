<script setup lang="ts">
import { ArrowRight, FileText } from '@lucide/vue'
import { useContent } from '@/composables/useContent'

const content = useContent()
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <span class="h-1.5 w-1.5 rounded-full bg-primary" />
      <p class="font-mono text-xs tracking-[0.3em] text-primary uppercase">
        {{ content.hero.label }}
      </p>
    </div>

    <h1
      class="mt-6 font-mono text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]"
    >
      {{ content.hero.name }}
    </h1>

    <p
      class="mt-6 font-mono text-2xl leading-tight font-semibold tracking-tight text-foreground sm:text-[1.75rem]"
    >
      {{ content.hero.valueProp }}
      <br />
      <span class="text-gradient">{{ content.hero.valuePropAccent }}</span>
    </p>

    <p
      v-if="content.hero.subtitle"
      class="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground"
    >
      {{ content.hero.subtitle }}
    </p>

    <div class="mt-9 flex flex-wrap items-center gap-3">
      <RouterLink to="/contact" class="btn-primary">
        {{ content.hero.ctaPrimary.label }}
        <ArrowRight class="h-4 w-4" />
      </RouterLink>
      <RouterLink v-if="content.cv.href" :to="content.cv.href" class="btn-secondary">
        <FileText class="h-4 w-4" />
        {{ content.ui.downloadCv }}
      </RouterLink>
    </div>
  </div>
</template>
