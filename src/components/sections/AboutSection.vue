<script setup lang="ts">
import RevealOnScroll from '@/components/ui/RevealOnScroll.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useContent } from '@/composables/useContent'

const content = useContent()
</script>

<template>
  <section id="about" class="py-20 lg:py-28" aria-labelledby="about-heading">
    <div class="container mx-auto px-4 lg:px-8">
      <RevealOnScroll>
        <SectionHeading
          id="about-heading"
          :command="content.about.command"
          :title="content.about.title"
        />
      </RevealOnScroll>
      <div class="mt-10 grid gap-6 lg:max-w-4xl lg:gap-8">
        <RevealOnScroll v-for="(paragraph, index) in content.about.paragraphs" :key="index">
          <p class="text-base leading-relaxed text-muted lg:text-lg">{{ paragraph }}</p>
        </RevealOnScroll>
      </div>
    </div>
  </section>
</template>
