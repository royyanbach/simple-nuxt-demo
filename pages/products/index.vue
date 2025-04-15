<script setup lang="ts">
import { ref, computed, watch } from 'vue';

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

const route = useRoute();
const router = useRouter();
const currentPage = ref(route.query.page ? parseInt(route.query.page as string, 10) : 1);
const itemsPerPage = 4;

const apiParams = computed(() => {
  const params: Record<string, string | number> = {
    page: currentPage.value,
    limit: itemsPerPage
  };

  if (route.query.search) {
    params.search = route.query.search as string;
  }

  return params;
});

const { data, pending, error } = useFetch<ApiResponse>('/api/products', {
  query: apiParams,
  watch: [apiParams]
});

watch(currentPage, (newPage) => {
  router.push({
    query: {
      ...route.query,
      page: newPage
    }
  });
});

const changePage = (page: number) => {
  currentPage.value = page;
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const products = computed(() => {
  if (!data.value?.data) return [];
  return data.value.data;
});
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <main class="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          All Products
          <span v-if="route.query.search" class="text-gray-600 dark:text-gray-400">
            - {{ route.query.search }}
          </span>
        </h1>
      </div>

      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <USkeleton v-for="n in itemsPerPage" :key="n" class="h-64 w-full rounded-lg" />
      </div>

      <div v-else-if="error" class="text-center py-10">
        <UIcon name="i-heroicons-exclamation-triangle" class="text-4xl text-red-500 mx-auto" />
        <p class="mt-4 text-lg text-red-600 dark:text-red-400">
          Failed to load products. Please try again later.
        </p>
      </div>

      <div v-else-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          <img
            :src="product.logoLocation"
            :alt="`${product.name} Logo`"
            class="object-cover w-full h-32"
            loading="lazy"
          />
          <div class="flex flex-col gap-4 p-4 grow">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {{ product.name }}
            </h3>
            <ClientOnly>
              <div class="text-sm text-gray-500 dark:text-gray-400 mt-2" v-html="product.shortDescription" />
            </ClientOnly>
          </div>
          <div class="px-4 pb-4">
            <NuxtLink :to="`/products/${product.id}`" class="w-full">
              <UButton
                class="cursor-pointer"
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
        <UIcon name="i-heroicons-magnifying-glass" class="text-4xl text-gray-400 dark:text-gray-500 mx-auto" />
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          No products found for "{{ route.query.search }}".
        </p>
      </div>

      <div v-if="(data?.pagination?.totalPages || 0) > 1" class="mt-8 flex justify-center">
        <UPagination
          v-model:page="currentPage"
          :total="data?.pagination?.total || 0"
          :items-per-page="itemsPerPage"
          @change="changePage"
        />
      </div>
    </main>
  </div>
</template>