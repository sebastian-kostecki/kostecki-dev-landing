<script setup lang="ts">
import { computed } from 'vue'
import { Printer } from '@lucide/vue'
import { useContent } from '@/composables/useContent'

const content = useContent()

const profile = computed(() => content.value.summary.items.filter((item) => !item.href))
const experience = computed(() => [
  content.value.projects.featured,
  content.value.projects.openSource,
])
const products = computed(() =>
  content.value.projects.personal.items.filter((project) => project.featured),
)
const contacts = computed(() => content.value.contact.methods)

function hostOf(url: string) {
  return new URL(url).host
}

function printCv() {
  window.print()
}
</script>

<template>
  <div class="relative">
    <div aria-hidden="true" class="gradient-hero absolute inset-x-0 top-0 h-80 print:hidden" />
    <div class="relative mx-auto max-w-4xl px-4 pt-24 pb-24 sm:px-6 lg:px-8 print:p-0">
      <div class="mb-8 flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <p class="font-mono text-xs tracking-[0.3em] text-primary uppercase">
            {{ content.cv.title }}
          </p>
          <p class="mt-3 max-w-xl text-sm text-muted-foreground">{{ content.cv.intro }}</p>
        </div>
        <div class="flex flex-col items-start gap-2 sm:items-end">
          <button type="button" class="btn-primary" @click="printCv">
            <Printer class="h-4 w-4" />
            {{ content.cv.print }}
          </button>
          <p class="font-mono text-[11px] text-muted-foreground">{{ content.cv.printHint }}</p>
        </div>
      </div>

      <article
        class="cv-sheet panel rounded-md p-6 sm:p-10 print:rounded-none print:border-0 print:p-0"
      >
        <header
          class="flex flex-wrap items-start justify-between gap-6 border-b border-border pb-6"
        >
          <div>
            <h1 class="font-mono text-3xl font-bold text-foreground">{{ content.hero.name }}</h1>
            <p class="mt-2 font-mono text-sm text-primary">{{ content.hero.label }}</p>
          </div>
          <ul class="grid gap-1 text-right font-mono text-xs text-muted-foreground">
            <li v-for="method in contacts" :key="method.type">
              <a :href="method.href" class="hover:text-primary">{{ method.value }}</a>
            </li>
            <li><a href="https://kostecki.dev" class="hover:text-primary">kostecki.dev</a></li>
          </ul>
        </header>

        <section class="cv-section">
          <h2 class="cv-heading">{{ content.cv.summaryTitle }}</h2>
          <p class="text-sm leading-relaxed text-foreground/85">
            {{ content.about.paragraphs[0] }}
          </p>
          <dl class="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            <div v-for="item in profile" :key="item.label" class="flex gap-2">
              <dt class="shrink-0 font-mono text-xs text-muted-foreground">{{ item.label }}:</dt>
              <dd class="text-foreground/85">{{ item.value }}</dd>
            </div>
          </dl>
        </section>

        <section class="cv-section">
          <h2 class="cv-heading">{{ content.cv.experienceTitle }}</h2>
          <div class="grid gap-6">
            <div v-for="job in experience" :key="job.title" class="cv-avoid-break">
              <div class="flex flex-wrap items-baseline justify-between gap-2">
                <h3 class="font-mono text-base font-semibold text-foreground">
                  {{ job.context.role }} · {{ job.title }}
                </h3>
                <span class="font-mono text-xs text-muted-foreground">
                  {{ job.context.employer }} · {{ job.context.period }}
                </span>
              </div>
              <p class="mt-1 text-sm text-foreground/80">{{ job.description }}</p>
              <ul
                class="mt-2 list-disc space-y-0.5 pl-5 text-sm text-foreground/80 marker:text-primary"
              >
                <li v-for="item in job.responsibilities" :key="item">{{ item }}</li>
              </ul>
            </div>
            <div class="cv-avoid-break">
              <div class="flex flex-wrap items-baseline justify-between gap-2">
                <h3 class="font-mono text-base font-semibold text-foreground">
                  {{ content.projects.commercialGroup.context.role }} ·
                  {{ content.projects.commercialGroup.title }}
                </h3>
                <span class="font-mono text-xs text-muted-foreground">
                  {{ content.projects.commercialGroup.context.employer }} ·
                  {{ content.projects.commercialGroup.context.period }}
                </span>
              </div>
              <p class="mt-1 text-sm text-foreground/80">
                {{ content.projects.commercialGroup.authorship }}
                {{ content.projects.commercialGroup.items.map((item) => item.title).join(', ') }}.
              </p>
            </div>
          </div>
        </section>

        <section class="cv-section">
          <h2 class="cv-heading">{{ content.cv.productsTitle }}</h2>
          <div class="grid gap-5 sm:grid-cols-2">
            <div v-for="project in products" :key="project.title" class="cv-avoid-break">
              <h3 class="font-mono text-base font-semibold text-foreground">{{ project.title }}</h3>
              <p class="font-mono text-xs text-primary">
                <template v-for="link in project.links.filter((l) => l.primary)" :key="link.url">
                  {{ hostOf(link.url) }}
                </template>
              </p>
              <p class="mt-1 text-sm text-foreground/80">{{ project.subtitle }}</p>
              <ul
                class="mt-2 list-disc space-y-0.5 pl-5 text-sm text-foreground/80 marker:text-primary"
              >
                <li v-for="item in project.highlights?.slice(0, 3)" :key="item">{{ item }}</li>
              </ul>
              <p class="mt-2 font-mono text-[11px] text-muted-foreground">
                {{ project.tags.join(' · ') }}
              </p>
            </div>
          </div>
        </section>

        <section class="cv-section">
          <h2 class="cv-heading">{{ content.cv.skillsTitle }}</h2>
          <dl class="grid gap-2 text-sm">
            <div class="grid gap-1 sm:grid-cols-[12rem_1fr]">
              <dt class="font-mono text-xs text-muted-foreground">
                {{ content.skills.coreTitle }}
              </dt>
              <dd class="text-foreground/85">
                {{ content.skills.core.map((skill) => skill.name).join(', ') }}
              </dd>
            </div>
            <div
              v-for="category in content.skills.categories"
              :key="category.name"
              class="grid gap-1 sm:grid-cols-[12rem_1fr]"
            >
              <dt class="font-mono text-xs text-muted-foreground">{{ category.name }}</dt>
              <dd class="text-foreground/85">{{ category.tags.join(', ') }}</dd>
            </div>
          </dl>
        </section>

        <p class="mt-8 font-mono text-[10px] text-muted-foreground">{{ content.cv.generated }}</p>
      </article>
    </div>
  </div>
</template>
