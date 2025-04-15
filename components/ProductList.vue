<script setup lang="ts">
import type { Product } from '~/types';
import ProductCard from './ProductCard.vue';

interface Props {
  products: Product[];
}

defineProps<Props>();
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </div>
</template>