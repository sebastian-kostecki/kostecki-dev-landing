<script setup lang="ts">
import RevealOnScroll from '@/components/ui/RevealOnScroll.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useContent } from '@/composables/useContent'

const { about } = useContent()
</script>

<template>
  <section
    id="about"
    class="py-16 lg:py-24"
    aria-labelledby="about-heading"
  >
    <div class="container mx-auto px-4 lg:px-8">
      <RevealOnScroll>
        <SectionHeading id="about-heading" :title="about.title" />
      </RevealOnScroll>
      <div class="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-12">
        <RevealOnScroll v-for="(paragraph, index) in about.paragraphs" :key="index">
          <p class="text-base leading-relaxed text-muted lg:text-lg">{{ paragraph }}</p>
        </RevealOnScroll>
      </div>
    </div>
  </section>
</template>
