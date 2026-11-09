<script setup lang="ts">
import { computed } from 'vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import SocialLinkRow from '@/components/ui/SocialLinkRow.vue'
import { useContent } from '@/composables/useContent'

const content = useContent()
const hasCv = computed(() => content.value.cv.href.length > 0)
</script>

<template>
  <div class="relative">
    <div aria-hidden="true" class="gradient-hero absolute inset-x-0 top-0 h-80" />
    <div aria-hidden="true" class="grid-lines absolute inset-x-0 top-0 h-80" />
    <div class="relative mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        :index="content.contact.index"
        :title="content.contact.title"
        :subtitle="content.contact.subtitle"
        centered
      />
      <div class="grid gap-4">
        <SocialLinkRow
          v-for="method in content.contact.methods"
          :key="method.type"
          :href="method.href"
          :label="method.label"
          :value="method.value"
          :type="method.type"
        />
      </div>
      <div v-if="hasCv" class="mt-8 flex justify-center">
        <RouterLink :to="content.cv.href" class="btn-secondary">
          {{ content.ui.downloadCv }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>
