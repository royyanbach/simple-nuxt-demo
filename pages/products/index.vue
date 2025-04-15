<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProducts } from '~/services/productService';
import ProductList from '~/components/ProductList.vue';
import type { Product } from '~/types';

const route = useRoute();
const router = useRouter();

const searchQuery = ref<string>((route.query.search as string) || '');
const currentPage = ref<number>(parseInt(route.query.page as string) || 1);
const itemsPerPage = ref<number>(4);

const { data: apiResponse, pending, error, refresh } = useProducts({
  page: currentPage,
  limit: itemsPerPage,
  search: searchQuery,
});

const products = computed<Product[]>(() => apiResponse.value?.data || []);
const totalItems = computed<number>(() => apiResponse.value?.pagination?.total || 0);

watch(
  () => route.query,
  (newQuery) => {
    console.log('Route query changed:', newQuery);
    const newSearch = (newQuery.search as string) || '';
    const newPage = parseInt(newQuery.page as string) || 1;

    if (searchQuery.value !== newSearch) {
      searchQuery.value = newSearch;
      if (currentPage.value !== 1) {
        currentPage.value = 1;
      }
    }
    if (currentPage.value !== newPage) {
      currentPage.value = newPage;
    }
  },
  { deep: true }
);

const handlePageChange = (newPage: number) => {
  router.push({
    query: {
      ...route.query,
      page: newPage,
    },
  });
};

const handleRefresh = () => refresh();

</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 py-12">
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
        All Products
        <span v-if="searchQuery" class="text-lg text-gray-500 dark:text-gray-400 ml-2">
          (Results for "{{ searchQuery }}")
        </span>
      </h1>

      <div v-if="pending && !products.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <USkeleton v-for="n in itemsPerPage" :key="`skeleton-${n}`" class="h-64 w-full rounded-lg" />
      </div>

      <div v-else-if="error" class="text-center py-10">
        <UIcon name="i-heroicons-exclamation-triangle" class="text-4xl text-red-500 mx-auto" />
        <p class="mt-4 text-lg text-red-600 dark:text-red-400">
          Failed to load products. Please try again later.
        </p>
        <UButton label="Retry" @click="handleRefresh" class="mt-4" />
      </div>

      <div v-else-if="products.length > 0">
         <ProductList :products="products" />
         <div class="flex justify-center mt-8">
            <UPagination
              v-model:page="currentPage"
              :items-per-page="itemsPerPage"
              :total="totalItems"
              @update:page="handlePageChange"
            />
          </div>
      </div>

      <div v-else class="text-center py-10">
        <UIcon name="i-heroicons-circle-stack" class="text-4xl text-gray-400 dark:text-gray-500 mx-auto" />
        <p v-if="searchQuery" class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          No products found matching "{{ searchQuery }}".
        </p>
        <p v-else class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          No products found at the moment.
        </p>
      </div>
    </section>
  </div>
</template>