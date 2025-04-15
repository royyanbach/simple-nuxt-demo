<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductById, updateProduct } from '~/services/productService';
import ProductForm from '~/components/ProductForm.vue';
import type { FetchError } from 'ofetch';

type ProductFormData = {
  gvtId: number;
  name: string;
  productTagline: string;
  shortDescription: string;
  longDescription: string;
  productUrl: string;
  voucherTypeName: string;
  orderUrl: string;
  productTitle: string;
  variableDenomPriceMinAmount: number;
  variableDenomPriceMaxAmount: number;
  logoLocation: string;
};

const route = useRoute();
const router = useRouter();
const toast = useToast();

const productId = computed(() => route.params.id as string);
const { data: product, pending, error: fetchError, refresh } = useProductById(productId);

const isSaving = ref(false);


const handleFormSubmit = async (formData: ProductFormData) => {
  isSaving.value = true;
  try {
    if (!productId.value) {
      throw new Error('Product ID is missing');
    }

    const apiPayload = {
        ...formData,
        variableDenomPriceMinAmount: String(formData.variableDenomPriceMinAmount),
        variableDenomPriceMaxAmount: String(formData.variableDenomPriceMaxAmount),
    };

    await updateProduct(productId.value, apiPayload);

    toast.add({
      id: 'product_update_success',
      title: 'Success',
      description: `Product "${formData.name || product.value?.name || ''}" updated successfully.`,
      color: 'success',
      icon: 'i-heroicons-check-circle',
    });

    router.push(`/products/${productId.value}`);

  } catch (err: unknown) {
    console.error('Error updating product:', err);
    let errorMessage = 'An unexpected error occurred.';
    if (typeof err === 'object' && err !== null && 'data' in err) {
        const fetchErr = err as FetchError<{ message?: string }>;
        if (fetchErr.data?.message) {
            errorMessage = fetchErr.data.message;
        } else if (typeof fetchErr.message === 'string') {
             errorMessage = fetchErr.message;
        }
    } else if (err instanceof Error) {
        errorMessage = err.message;
    }
    toast.add({
      id: 'product_update_error',
      title: 'Error Updating Product',
      description: errorMessage,
      color: 'error',
      icon: 'i-heroicons-x-circle',
    });
  } finally {
    isSaving.value = false;
  }
};

const handleFormCancel = () => {
  router.push(`/products/${productId.value}`);
};

useHead(computed(() => ({
  title: product.value?.name ? `Edit ${product.value.name}` : 'Edit Product',
})));

const handleRefresh = () => refresh();

</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <main class="max-w-4xl mx-auto px-4 pt-8 pb-20 sm:px-6 lg:px-8">
      <div v-if="pending" class="flex flex-col gap-6">
        <div class="flex gap-6">
          <div class="flex-1 flex flex-col gap-4">
            <USkeleton class="h-8 w-1/2 rounded-lg" />
            <USkeleton class="h-6 w-1/4 rounded-lg" />
          </div>
        </div>
        <USkeleton class="h-96 w-full rounded-lg" />
      </div>

      <div v-else-if="fetchError" class="text-center py-10">
        <UIcon name="i-heroicons-exclamation-triangle" class="text-4xl text-red-500 mx-auto" />
        <p class="mt-4 text-lg text-red-600 dark:text-red-400">
          Failed to load product data for editing (Error: {{ fetchError.statusCode || 'Unknown' }}).
        </p>
        <p v-if="fetchError.message && fetchError.statusCode !== 404" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
           {{ fetchError.message }}
        </p>
        <p v-else-if="fetchError.statusCode === 404" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          The requested product could not be found.
        </p>
        <div class="mt-6 flex justify-center gap-4">
          <UButton label="Retry" @click="handleRefresh" color="primary" />
          <NuxtLink to="/products">
            <UButton color="neutral" label="Back to Products" />
          </NuxtLink>
        </div>
      </div>

      <ProductForm
        v-else-if="product"
        :initial-data="product"
        :is-saving="isSaving"
        @submit="handleFormSubmit"
        @cancel="handleFormCancel"
      />

       <div v-else class="text-center py-10">
         <UIcon name="i-heroicons-question-mark-circle" class="text-4xl text-gray-400 dark:text-gray-500 mx-auto" />
         <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
           Product data is unavailable for editing.
         </p>
         <NuxtLink to="/products" class="mt-6 inline-block">
           <UButton color="neutral" label="Back to Products" />
         </NuxtLink>
      </div>

    </main>
  </div>
</template>