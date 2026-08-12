<script setup lang="ts">
import { useContent } from '@/composables/useContent'

const content = useContent()
</script>

<template>
  <div class="flex min-h-[60vh] items-center justify-center px-4">
    <div class="max-w-md text-center">
      <p class="font-mono text-7xl font-bold text-foreground">404</p>
      <h1 class="mt-4 font-mono text-xl font-semibold text-foreground">
        {{ content.ui.notFoundTitle }}
      </h1>
      <p class="mt-2 text-sm text-muted-foreground">{{ content.ui.notFoundBody }}</p>
      <RouterLink to="/" class="btn-primary mt-6 inline-flex">
        {{ content.ui.backHome }}
      </RouterLink>
    </div>
  </div>
</template>
