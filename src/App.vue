<script setup lang="ts">
import { onMounted, watch } from 'vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ExperienceSection from '@/components/sections/ExperienceSection.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import { useContent } from '@/composables/useContent'
import { useLocale } from '@/composables/useLocale'

const content = useContent()
const { locale } = useLocale()

function setMetaContent(selector: string, value: string) {
  const element = document.querySelector(selector)
  if (element) element.setAttribute('content', value)
}

function applyMeta() {
  const { meta } = content.value
  const ogLocale = meta.lang === 'pl' ? 'pl_PL' : 'en_US'

  document.title = meta.title
  document.documentElement.lang = meta.lang

  setMetaContent('meta[name="description"]', meta.description)
  setMetaContent('meta[property="og:title"]', meta.title)
  setMetaContent('meta[property="og:description"]', meta.description)
  setMetaContent('meta[property="og:locale"]', ogLocale)
  setMetaContent('meta[name="twitter:title"]', meta.title)
  setMetaContent('meta[name="twitter:description"]', meta.description)
}

onMounted(applyMeta)
watch(locale, applyMeta)
</script>

<template>
  <a href="#about" class="skip-link">{{ content.ui.skipToContent }}</a>
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
