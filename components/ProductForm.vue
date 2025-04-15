<script setup lang="ts">
import { reactive, watch } from 'vue';
import * as z from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import type { Product } from '~/types';

interface Props {
  initialData?: Product | null;
  isSaving?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  initialData: null,
  isSaving: false,
});

interface Emits {
  (e: 'submit', payload: Schema): void;
  (e: 'cancel'): void;
}
const emit = defineEmits<Emits>();

const schema = z.object({
  gvtId: z.number().min(1, "Game ID is required"),
  name: z.string().min(1, "Name is required"),
  productTagline: z.string().min(1, "Tagline is required"),
  shortDescription: z.string().min(1, "Short description is required").max(2000, "Short description too long"),
  longDescription: z.string().min(1, "Long description is required").max(2000, "Long description too long"),
  productUrl: z.string().min(1, "Product URL is required"),
  voucherTypeName: z.string().min(1, "Voucher type is required"),
  orderUrl: z.string().url("Invalid Order URL format"),
  productTitle: z.string().min(1, "Product title is required"),
  variableDenomPriceMinAmount: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Min price cannot be negative")
  ),
  variableDenomPriceMaxAmount: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Max price cannot be negative")
  ),
  logoLocation: z.string().min(1, "Logo location is required"),
});

type Schema = z.output<typeof schema>

const getInitialState = (): Schema => ({
  gvtId: props.initialData?.gvtId ?? 0,
  name: props.initialData?.name ?? '',
  productTagline: props.initialData?.productTagline ?? '',
  shortDescription: props.initialData?.shortDescription ?? '',
  longDescription: props.initialData?.longDescription ?? '',
  productUrl: props.initialData?.productUrl ?? '',
  voucherTypeName: props.initialData?.voucherTypeName ?? '',
  orderUrl: props.initialData?.orderUrl ?? '',
  productTitle: props.initialData?.productTitle ?? '',
  variableDenomPriceMinAmount: Number(props.initialData?.variableDenomPriceMinAmount ?? 0),
  variableDenomPriceMaxAmount: Number(props.initialData?.variableDenomPriceMaxAmount ?? 0),
  logoLocation: props.initialData?.logoLocation ?? '',
});

const state = reactive<Schema>(getInitialState());

watch(() => props.initialData, () => {
  Object.assign(state, getInitialState());
}, { deep: true });

const handleSubmit = (event: FormSubmitEvent<Schema>) => {
  console.log('ProductForm validated data:', event.data);
  emit('submit', event.data);
};

const handleCancel = () => {
  emit('cancel');
};

</script>

<template>
  <UForm :schema="schema" :state="state" @submit="handleSubmit" class="flex flex-col gap-6">
    <div class="border-b border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
      <h2 class="text-lg mb-4 font-medium text-gray-900 dark:text-white">Basic Information</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField label="Game ID" name="gvtId" required>
          <UInput
            v-model.number="state.gvtId"
            class="w-full"
            type="number"
            placeholder="Enter game ID"
          />
        </UFormField>
        <UFormField label="Product Title" name="productTitle" required>
          <UInput
            v-model="state.productTitle"
            class="w-full"
            placeholder="Enter product title"
          />
        </UFormField>
        <UFormField label="Name" name="name" required>
          <UInput
            v-model="state.name"
            class="w-full"
            placeholder="Enter product name"
          />
        </UFormField>
        <UFormField label="Product Tagline" name="productTagline" required>
          <UInput
            v-model="state.productTagline"
            class="w-full"
            placeholder="Enter product tagline"
          />
        </UFormField>
      </div>
    </div>


    <div class="border-t border-b border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
        <h2 class="text-lg mb-4 font-medium text-gray-900 dark:text-white">Classification & URLs</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Voucher Type" name="voucherTypeName" required>
              <UInput
                v-model="state.voucherTypeName"
                class="w-full"
                placeholder="Enter voucher type"
              />
            </UFormField>
            <UFormField label="Product URL" name="productUrl" required>
              <UInput
                v-model="state.productUrl"
                class="w-full"
                placeholder="Enter product URL"
              />
            </UFormField>
            <UFormField label="Order URL" name="orderUrl" required>
              <UInput
                v-model="state.orderUrl"
                class="w-full"
                placeholder="Enter order URL (e.g., https://...)"
              />
            </UFormField>
        </div>
    </div>


    <div class="border-t border-b border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
        <h2 class="text-lg mb-4 font-medium text-gray-900 dark:text-white">Product Descriptions</h2>
        <div class="grid grid-cols-1 gap-6">
            <UFormField label="Short Description" name="shortDescription" required>
              <UTextarea
                v-model="state.shortDescription"
                class="w-full font-mono text-sm"
                placeholder="Enter short description"
                :rows="6"
              />
            </UFormField>
            <UFormField label="Long Description" name="longDescription" required>
              <UTextarea
                v-model="state.longDescription"
                class="w-full font-mono text-sm"
                placeholder="Enter long description"
                :rows="12"
              />
            </UFormField>
        </div>
    </div>


     <div class="border-t border-b border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
          <h2 class="text-lg mb-4 font-medium text-gray-900 dark:text-white">Optional Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Logo Location" name="logoLocation" required>
              <UInput
                v-model="state.logoLocation"
                class="w-full"
                placeholder="Enter logo URL"
              />
            </UFormField>

            <UFormField label="Min Price Amount" name="variableDenomPriceMinAmount">
              <UInput
                v-model.number="state.variableDenomPriceMinAmount"
                class="w-full"
                type="number"
                 step="0.01"
                placeholder="Enter minimum price"
              />
            </UFormField>

            <UFormField label="Max Price Amount" name="variableDenomPriceMaxAmount">
              <UInput
                v-model.number="state.variableDenomPriceMaxAmount"
                class="w-full"
                type="number"
                 step="0.01"
                placeholder="Enter maximum price"
              />
            </UFormField>
          </div>
        </div>


    <div class="sticky bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 mt-6">
      <div class="max-w-4xl mx-auto flex justify-end gap-4">
         <UButton
            type="button"
            color="neutral"
            variant="ghost"
            label="Cancel"
            :disabled="isSaving"
            @click="handleCancel"
          />
          <UButton
            type="submit"
            color="primary"
            :loading="isSaving"
            :disabled="isSaving"
            label="Save Changes"
          />
      </div>
    </div>

  </UForm>
</template>