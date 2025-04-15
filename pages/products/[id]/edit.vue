<script setup lang="ts">
import * as z from 'zod';

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

const schema = z.object({
  gvtId: z.number().min(1),
  name: z.string().min(1),
  productTagline: z.string().min(1),
  shortDescription: z.string().min(1).max(2000),
  longDescription: z.string().min(1).max(2000),
  productUrl: z.string().min(1),
  voucherTypeName: z.string().min(1),
  orderUrl: z.string().url(),
  productTitle: z.string().min(1),
  variableDenomPriceMinAmount: z.number().min(0),
  variableDenomPriceMaxAmount: z.number().min(0),
  logoLocation: z.string().min(1),
});

type Schema = z.output<typeof schema>

const route = useRoute();
const router = useRouter();
const toast = useToast();
const productId = parseInt(route.params.id as string);

const isSubmitting = ref(false);
const formErrors = ref<Record<string, string>>({});

const { data: product, pending, error } = await useFetch<Product>(`/api/products/${productId}`);

const formData = reactive<Partial<Schema>>({
  gvtId: 0,
  name: '',
  productTagline: '',
  shortDescription: '',
  longDescription: '',
  productUrl: '',
  voucherTypeName: '',
  orderUrl: '',
  productTitle: '',
  variableDenomPriceMinAmount: 0,
  variableDenomPriceMaxAmount: 0,
  logoLocation: '',
});

watch(product, (newProduct) => {
  if (newProduct) {
    formData.gvtId = Number(newProduct.gvtId);
    formData.name = newProduct.name;
    formData.productTagline = newProduct.productTagline;
    formData.shortDescription = newProduct.shortDescription;
    formData.longDescription = newProduct.longDescription;
    formData.productUrl = newProduct.productUrl;
    formData.voucherTypeName = newProduct.voucherTypeName;
    formData.orderUrl = newProduct.orderUrl;
    formData.productTitle = newProduct.productTitle;
    formData.variableDenomPriceMinAmount = Number(newProduct.variableDenomPriceMinAmount);
    formData.variableDenomPriceMaxAmount = Number(newProduct.variableDenomPriceMaxAmount);
    formData.logoLocation = newProduct.logoLocation;
  }
}, { immediate: true });

const submitForm = async () => {
  isSubmitting.value = true;

  try {
    await $fetch(`/api/products/${productId}`, {
      method: 'PUT',
      body: formData
    });

    toast.add({
      title: 'Success',
      description: 'Product updated successfully',
      color: 'success'
    });

    router.push(`/products/${productId}`);
  } catch (err) {
    console.error('Error updating product:', err);
    toast.add({
      title: 'Error',
      description: 'Failed to update product',
      color: 'error'
    });
  } finally {
    isSubmitting.value = false;
  }
};

useHead({
  title: product.value?.name ? `Edit ${product.value.name}` : 'Edit Product',
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <main class="max-w-4xl mx-auto px-4 pt-8 pb-20 sm:px-6 lg:px-8">
      <div v-if="pending" class="flex flex-col gap-6">
        <div class="flex gap-6">
          <div class="flex-1 flex flex-col gap-4">
            <USkeleton class="h-12 w-3/4 rounded-lg" />
            <USkeleton class="h-6 w-1/2 rounded-lg" />
            <USkeleton class="h-6 w-full rounded-lg" />
            <USkeleton class="h-6 w-full rounded-lg" />
          </div>
        </div>
        <USkeleton class="h-96 w-full rounded-lg" />
      </div>

      <div v-else-if="error" class="text-center py-10">
        <UIcon name="i-heroicons-exclamation-triangle" class="text-4xl text-red-500 mx-auto" />
        <p class="mt-4 text-lg text-red-600 dark:text-red-400">
          Failed to load product details. Please try again later.
        </p>
        <NuxtLink to="/products" class="mt-6 inline-block">
          <UButton color="neutral" label="Go Back to Products" />
        </NuxtLink>
      </div>

      <UForm :schema="schema" :state="formData" @submit="submitForm" class="flex flex-col gap-6">
        <div class="border-b border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
          <h2 class="text-lg mb-4 font-medium text-gray-900 dark:text-white">Basic Information</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField class="space-y-2" label="Game ID" name="gvtId" help-text="Unique identifier for the game" :error="formErrors.gvtId">
              <UInput
                v-model.number="formData.gvtId"
                type="number"
                class="w-full"
                placeholder="Enter game ID"
                :error="!!formErrors.gvtId"
              />
            </UFormField>

            <UFormField class="space-y-2" label="Product Title" name="productTitle" help-text="Full product title with branding" :error="formErrors.productTitle">
              <UInput
                v-model="formData.productTitle"
                class="w-full"
                placeholder="Enter product title"
                :error="!!formErrors.productTitle"
              />
            </UFormField>

            <UFormField class="space-y-2" label="Name" name="name" help-text="Short product name" :error="formErrors.name">
              <UInput
                v-model="formData.name"
                class="w-full"
                placeholder="Enter product name"
              />
            </UFormField>

            <UFormField class="space-y-2" label="Product Tagline" name="productTagline" help-text="Brief marketing tagline" :error="formErrors.productTagline">
              <UInput
                v-model="formData.productTagline"
                class="w-full"
                placeholder="Enter product tagline"
                :error="!!formErrors.productTagline"
              />
            </UFormField>
          </div>
        </div>


        <div class="border-t border-b border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
          <h2 class="text-lg mb-4 font-medium text-gray-900 dark:text-white">Classification & URLs</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField class="space-y-2" label="Voucher Type" name="voucherTypeName" help-text="Category of voucher" :error="formErrors.voucherTypeName">
              <UInput
                v-model="formData.voucherTypeName"
                class="w-full"
                placeholder="Enter voucher type"
                :error="!!formErrors.voucherTypeName"
              />
            </UFormField>

            <UFormField class="space-y-2" label="Product URL" name="productUrl" help-text="Web address for the product page" :error="formErrors.productUrl">
              <UInput
                v-model="formData.productUrl"
                class="w-full"
                placeholder="Enter product URL"
                :error="!!formErrors.productUrl"
              />
            </UFormField>

            <UFormField class="space-y-2" label="Order URL" name="orderUrl" help-text="Web address for ordering" :error="formErrors.orderUrl">
              <UInput
                v-model="formData.orderUrl"
                class="w-full"
                placeholder="Enter order URL"
                :error="!!formErrors.orderUrl"
              />
            </UFormField>
          </div>
        </div>

        <div class="border-t border-b border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
          <h2 class="text-lg mb-4 font-medium text-gray-900 dark:text-white">Product Descriptions</h2>
          <div class="grid grid-cols-1 gap-6">
            <UFormField class="space-y-2" label="Short Description" name="shortDescription" help-text="Brief summary of the product (HTML supported)" :error="formErrors.shortDescription">
              <UTextarea
                v-model="formData.shortDescription"
                class="w-full font-mono text-sm"
                placeholder="Enter short description"
                :error="!!formErrors.shortDescription"
                :rows="6"
              />
            </UFormField>

            <UFormField class="space-y-2" label="Long Description" name="longDescription" help-text="Comprehensive product details (HTML supported)" :error="formErrors.longDescription">
              <UTextarea
                v-model="formData.longDescription"
                class="w-full font-mono text-sm"
                placeholder="Enter long description"
                :error="!!formErrors.longDescription"
                :rows="12"
              />
            </UFormField>
          </div>
        </div>

        <div class="border-t border-b border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
          <h2 class="text-lg mb-4 font-medium text-gray-900 dark:text-white">Optional Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField class="space-y-2" label="Logo Location" name="logoLocation" help-text="URL for the product logo (optional)" :error="formErrors.logoLocation">
              <UInput
                v-model="formData.logoLocation"
                class="w-full"
                placeholder="Enter logo URL"
                :error="!!formErrors.logoLocation"
              />
            </UFormField>

            <UFormField class="space-y-2" label="Min Price Amount" name="variableDenomPriceMinAmount" help-text="Minimum price amount (optional)" :error="formErrors.variableDenomPriceMinAmount">
              <UInput
                v-model="formData.variableDenomPriceMinAmount"
                type="number"
                class="w-full"
                placeholder="Enter minimum price"
                :error="!!formErrors.variableDenomPriceMinAmount"
              />
            </UFormField>

            <UFormField class="space-y-2" label="Max Price Amount" name="variableDenomPriceMaxAmount" help-text="Maximum price amount (optional)" :error="formErrors.variableDenomPriceMaxAmount">
              <UInput
                v-model="formData.variableDenomPriceMaxAmount"
                type="number"
                class="w-full"
                placeholder="Enter maximum price"
                :error="!!formErrors.variableDenomPriceMaxAmount"
              />
            </UFormField>
          </div>
        </div>

        <div class="fixed bottom-0 left-0 right-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
          <div class="flex justify-end gap-4 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <UButton
              type="button"
              color="neutral"
              variant="ghost"
              label="Cancel"
              @click="router.push(`/products/${productId}`)"
            />
            <UButton
              type="submit"
              color="primary"
              :loading="isSubmitting"
              :disabled="isSubmitting"
              label="Update Product"
            />
          </div>
        </div>
      </UForm>
    </main>
  </div>
</template>