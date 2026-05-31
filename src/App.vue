<script setup lang="ts">
import { onMounted } from 'vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ExperienceSection from '@/components/sections/ExperienceSection.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import { useContent } from '@/composables/useContent'

const { meta } = useContent()

onMounted(() => {
  document.title = meta.title
  const description = document.querySelector('meta[name="description"]')
  if (description) {
    description.setAttribute('content', meta.description)
  }
})
</script>

<template>
  <a href="#about" class="skip-link">Przejdź do treści</a>
  <SiteHeader />
  <HeroSection />
  <main id="main-content">
    <AboutSection />
    <ExperienceSection />
    <SkillsSection />
    <ProjectsSection />
    <ContactSection />
  </main>
  <SiteFooter />
</template>
