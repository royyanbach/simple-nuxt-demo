<script setup lang="ts">
import type { Product } from '~/types';

interface Props {
  product: Product;
}

defineProps<Props>();
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div class="aspect-w-16 aspect-h-9">
          <img
            :src="product.logoLocation"
            :alt="`${product.name} Logo`"
            class="w-full h-full object-cover"
            loading="eager"
          />
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ product.name }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          {{ product.productTagline }}
        </p>
      </div>
    </div>

    <div class="space-y-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Product Details
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div class="space-y-4">
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div class="text-sm text-gray-500 dark:text-gray-400">Name</div>
                <div class="font-medium text-gray-900 dark:text-white">{{ product.name }}</div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div class="text-sm text-gray-500 dark:text-gray-400">Product ID</div>
                <div class="font-medium text-gray-900 dark:text-white">{{ product.id }}</div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div class="text-sm text-gray-500 dark:text-gray-400">Game ID</div>
                <div class="font-medium text-gray-900 dark:text-white">{{ product.gvtId }}</div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div class="text-sm text-gray-500 dark:text-gray-400">Voucher Type</div>
                <div class="font-medium text-gray-900 dark:text-white">{{ product.voucherTypeName }}</div>
              </div>
            </div>
          </div>

          <div>
            <div class="space-y-4">
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div class="text-sm text-gray-500 dark:text-gray-400">Product URL</div>
                <a :href="product.productUrl" target="_blank" rel="noopener noreferrer" class="font-medium text-primary-600 dark:text-primary-400 hover:underline truncate block">
                  {{ product.productUrl }}
                </a>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div class="text-sm text-gray-500 dark:text-gray-400">Order URL</div>
                <a :href="product.orderUrl" target="_blank" rel="noopener noreferrer" class="font-medium text-primary-600 dark:text-primary-400 hover:underline truncate block">
                  {{ product.orderUrl }}
                </a>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div class="text-sm text-gray-500 dark:text-gray-400">Min Price Amount</div>
                <div class="font-medium text-gray-900 dark:text-white">{{ product.variableDenomPriceMinAmount }}</div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div class="text-sm text-gray-500 dark:text-gray-400">Max Price Amount</div>
                <div class="font-medium text-gray-900 dark:text-white">{{ product.variableDenomPriceMaxAmount }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          About this Product
        </h2>

        <div class="mb-8">
          <h3 class="font-semibold text-lg text-gray-900 dark:text-white mb-4">Description</h3>
          <div class="prose dark:prose-invert prose-sm sm:prose-base max-w-none" v-html="product.shortDescription"></div>
        </div>

        <div>
          <h3 class="font-semibold text-lg text-gray-900 dark:text-white mb-4">Full Description</h3>
          <div class="prose dark:prose-invert prose-sm sm:prose-base max-w-none" v-html="product.longDescription"></div>
        </div>
      </div>
    </div>
  </div>
</template>