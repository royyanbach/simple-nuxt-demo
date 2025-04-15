<script setup lang="ts">
import { computed } from 'vue';

interface Product {
    id: number;
    gvtId: number;
    name: string;
    productTagline: string;
    shortDescription: string;
    longDescription: string;
    logoLocation: string;
    productUrl: string;
    voucherTypeName: string;
    orderUrl: string;
    productTitle: string;
    variableDenomPriceMinAmount: string;
    variableDenomPriceMaxAmount: string;
    __typename: string;
}

interface ApiResponse {
    data: Product[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

const { data, pending, error } = await useFetch<ApiResponse>('/api/products', {
  query: {
    page: 1,
    limit: 2
  }
});

const latestProducts = computed(() => {
    return data.value?.data || [];
});
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <section class="max-w-4xl min-h-[40vh] mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col justify-center items-center gap-4">
      <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl text-center">
        Game Voucher Marketplace
      </h1>
      <p class="text-lg leading-8 text-gray-600 dark:text-gray-300 text-center">
        Find and top up your favorite game vouchers instantly.
      </p>

      <div class="mt-4">
        <NuxtLink to="/products">
          <UButton
            label="Browse All Games"
            color="primary"
            size="xl"
          />
        </NuxtLink>
      </div>
    </section>

    <section class="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Latest Games
        </h2>
        <NuxtLink to="/products">
          <UButton
            label="View All Games"
            variant="link"
            color="primary"
            trailing-icon="i-heroicons-arrow-right-20-solid"
          />
        </NuxtLink>
      </div>

      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <USkeleton v-for="n in 5" :key="n" class="h-64 w-full rounded-lg" />
      </div>

      <div v-else-if="error" class="text-center py-10">
        <UIcon name="i-heroicons-exclamation-triangle" class="text-4xl text-red-500 mx-auto" />
        <p class="mt-4 text-lg text-red-600 dark:text-red-400">
          Failed to load products. Please try again later.
        </p>
      </div>

      <div v-else-if="latestProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="product in latestProducts"
          :key="product.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
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
              >
                View Details
              </UButton>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-10">
        <UIcon name="i-heroicons-circle-stack" class="text-4xl text-gray-400 dark:text-gray-500 mx-auto" />
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          No products found at the moment.
        </p>
      </div>
    </section>
  </div>
</template>
