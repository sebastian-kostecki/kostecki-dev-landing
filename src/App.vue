<script setup lang="ts">
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
</script>

<template>
  <a href="#about" class="skip-link">Przejdź do treści</a>
  <SiteHeader />
  <HeroSection />
  <main id="main-content">
    <AboutSection />
    <SkillsSection />
    <ProjectsSection />
    <ContactSection />
  </main>
  <SiteFooter />
</template>
