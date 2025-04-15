<script setup lang="ts">
import { computed, ref } from 'vue';
import { useProducts } from '~/services/productService';
import type { Product } from '~/types';
import ProductList from '~/components/ProductList.vue';

// Define reactive refs for pagination if needed for controls later
const currentPage = ref(1);
const itemsPerPage = ref(2); // Keep the limit consistent with previous code for now

// Use the composable to fetch products
const { data: apiResponse, pending, error } = await useProducts({
  page: currentPage,
  limit: itemsPerPage,
});

// Adjust computed property to access data from the nested structure
const latestProducts = computed<Product[]>(() => {
    return apiResponse.value?.data || [];
});

// Computed for pagination info if needed
// const paginationInfo = computed(() => {
//     return apiResponse.value?.pagination;
// });

// Function to handle page changes (example)
// const handlePageChange = (newPage: number) => {
//   currentPage.value = newPage;
//   // The useFetch inside useProducts will automatically refetch due to the query being computed
// };
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
        <USkeleton v-for="n in itemsPerPage" :key="`skeleton-${n}`" class="h-64 w-full rounded-lg" />
      </div>

      <div v-else-if="error" class="text-center py-10">
        <UIcon name="i-heroicons-exclamation-triangle" class="text-4xl text-red-500 mx-auto" />
        <p class="mt-4 text-lg text-red-600 dark:text-red-400">
          Failed to load products. Please try again later.
        </p>
      </div>

      <ProductList v-else-if="latestProducts.length > 0" :products="latestProducts" />

      <div v-else class="text-center py-10">
        <UIcon name="i-heroicons-circle-stack" class="text-4xl text-gray-400 dark:text-gray-500 mx-auto" />
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          No products found at the moment.
        </p>
      </div>
    </section>
  </div>
</template>
