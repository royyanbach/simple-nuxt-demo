<script setup lang="ts">
import type { Product } from '~/types';

interface Props {
  product: Product;
}

defineProps<Props>();
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
    <div class="p-4">
      <div class="aspect-w-16 aspect-h-9 mb-3">
        <img
          :src="product.logoLocation"
          :alt="`${product.name} Logo`"
          class="object-cover w-full h-32 rounded"
          loading="lazy"
        />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
        {{ product.name }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
        {{ product.productTagline }}
      </p>
    </div>
    <div class="px-4 pb-4">
      <NuxtLink :to="`/products/${product.id}`" class="w-full">
        <UButton
          color="primary"
          variant="solid"
          block
          :aria-label="`View details for ${product.name}`"
        >
          View Details
        </UButton>
      </NuxtLink>
    </div>
  </div>
</template>