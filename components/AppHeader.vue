<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';

const route = useRoute();
const router = useRouter();
const searchQuery = ref('');

const isHomePage = computed(() => route.path === '/');
const isProductsPage = computed(() => route.path === '/products');
const isProductDetailPage = computed(() =>
  route.path.match(/^\/products\/\d+$/) && !route.path.includes('/edit')
);
const isProductEditPage = computed(() => route.path.includes('/edit'));

const productId = computed(() => {
  const match = route.path.match(/\/products\/(\d+)/);
  return match ? match[1] : null;
});

const debouncedSearchUpdate = useDebounceFn((query: string) => {
  router.push({
    path: '/products',
    query: query ? { search: query } : undefined,
  });
}, 300);

watch(searchQuery, (newValue) => {
  if (isProductsPage.value) {
    debouncedSearchUpdate(newValue);
  }
});

const handleSearch = () => {
  debouncedSearchUpdate(searchQuery.value);
};

const goBack = () => {
  router.back();
};

const goToEditProduct = () => {
  if (!productId.value) return;
  router.push(`/products/${productId.value}/edit`);
};

watch(() => route.query.search, (newQuery) => {
  const currentQuery = (newQuery as string || '');
  if (searchQuery.value !== currentQuery) {
    searchQuery.value = currentQuery;
  }
  if (!isProductsPage.value && !newQuery) {
    searchQuery.value = '';
  }
}, { immediate: true });
</script>

<template>
  <header v-if="!isHomePage" class="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md">
    <div class="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center gap-4">
        <template v-if="isProductsPage">
          <NuxtLink to="/" aria-label="Home" class="text-gray-800 dark:text-white">
            <UButton
              variant="ghost"
              color="primary"
              icon="i-heroicons-home"
              aria-label="Home"
            />
          </NuxtLink>

          <div class="w-full">
            <UInput
              v-model="searchQuery"
              class="w-full"
              placeholder="Search product name"
              size="lg"
              color="primary"
              @keyup.enter="handleSearch"
            >
              <template #trailing>
                <UButton
                  type="button"
                  size="sm"
                  color="primary"
                  variant="ghost"
                  icon="i-heroicons-magnifying-glass"
                  @click="handleSearch"
                  aria-label="Search"
                />
              </template>
            </UInput>
          </div>
        </template>

        <template v-else-if="isProductDetailPage">
          <div class="flex items-center">
            <UButton
              variant="ghost"
              color="primary"
              icon="i-heroicons-arrow-left"
              aria-label="Back"
              @click="goBack"
            />
          </div>

          <h3 class="grow text-xl text-gray-800 dark:text-white">Product Details</h3>

          <UButton
            color="primary"
            aria-label="Edit Product"
            @click="goToEditProduct"
          >
            Edit Product
          </UButton>
        </template>

        <template v-else-if="isProductEditPage">
          <div class="flex items-center gap-3">
            <UButton
              variant="ghost"
              color="primary"
              icon="i-heroicons-arrow-left"
              aria-label="Back"
              @click="goBack"
            />
            <span class="font-medium text-gray-800 dark:text-white truncate max-w-[200px] md:max-w-[400px]">
              Edit Product
            </span>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>