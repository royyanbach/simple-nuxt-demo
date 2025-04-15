<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProductById } from '~/services/productService';
import ProductDetail from '~/components/ProductDetail.vue';

const route = useRoute();
const productId = computed(() => route.params.id as string);

const { data: product, pending, error, refresh } = useProductById(productId);

useHead(computed(() => ({
  title: product.value?.name ? `${product.value.name} - Game Voucher Marketplace` : 'Product Details',
})));

const handleRefresh = () => refresh();

</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <main class="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div v-if="pending" class="flex flex-col gap-6">
        <div class="flex gap-6">
          <div class="flex-1 flex flex-col gap-4">
            <USkeleton class="h-12 w-3/4 rounded-lg" />
            <USkeleton class="h-6 w-1/2 rounded-lg" />
            <USkeleton class="h-6 w-full rounded-lg" />
            <USkeleton class="h-6 w-full rounded-lg" />
            <USkeleton class="h-10 w-40 rounded-lg" />
          </div>
        </div>
        <USkeleton class="h-64 w-full rounded-lg" />
      </div>

      <div v-else-if="error" class="text-center py-10">
        <UIcon name="i-heroicons-exclamation-triangle" class="text-4xl text-red-500 mx-auto" />
        <p class="mt-4 text-lg text-red-600 dark:text-red-400">
          Failed to load product details (Error: {{ error.statusCode || 'Unknown' }}). Please try again later.
        </p>
        <p v-if="error.message && error.statusCode !== 404" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {{ error.message }}
        </p>
        <p v-else-if="error.statusCode === 404" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          The requested product could not be found.
        </p>
        <div class="mt-6 flex justify-center gap-4">
          <UButton label="Retry" @click="handleRefresh" color="primary" />
          <NuxtLink to="/products">
            <UButton color="neutral" label="Back to Products" />
          </NuxtLink>
        </div>
      </div>

      <ProductDetail v-else-if="product" :product="product" />

      <div v-else class="text-center py-10">
         <UIcon name="i-heroicons-question-mark-circle" class="text-4xl text-gray-400 dark:text-gray-500 mx-auto" />
         <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
           Product data is unavailable.
         </p>
         <NuxtLink to="/products" class="mt-6 inline-block">
           <UButton color="neutral" label="Back to Products" />
         </NuxtLink>
      </div>

    </main>
  </div>
</template>