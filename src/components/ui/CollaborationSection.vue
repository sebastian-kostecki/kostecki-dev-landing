<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useContent } from '@/composables/useContent'
import { COLLABORATION_ANCHOR } from '@/router/scroll'

const content = useContent()
</script>

<template>
  <section
    :id="COLLABORATION_ANCHOR"
    class="px-4 py-24 sm:px-6 lg:px-8"
    aria-labelledby="collaboration-heading"
  >
    <div class="mx-auto max-w-6xl">
      <SectionHeading
        heading-id="collaboration-heading"
        :index="content.collaboration.index"
        :title="content.collaboration.title"
        :subtitle="content.collaboration.subtitle"
      />

      <ul class="grid gap-5 md:grid-cols-2">
        <li
          v-for="service in content.collaboration.services"
          :key="service.title"
          class="panel flex flex-col rounded-md p-6 sm:p-8"
        >
          <h3 class="font-mono text-lg font-semibold text-card-foreground">
            {{ service.title }}
          </h3>
          <p class="mt-2 font-mono text-xs leading-relaxed text-primary-glow">
            {{ service.scope }}
          </p>
          <p class="mt-4 text-sm leading-relaxed text-muted-foreground">{{ service.outcome }}</p>
        </li>
      </ul>

      <div class="mt-10">
        <RouterLink :to="content.collaboration.cta.href" class="btn-primary">
          {{ content.collaboration.cta.label }}
          <ArrowRight class="h-4 w-4" aria-hidden="true" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>
