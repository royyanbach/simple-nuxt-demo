import type { Ref } from 'vue';
import type { Product, ApiResponse } from '~/types';

interface UseProductsOptions {
  page?: Ref<number>;
  limit?: Ref<number>;
  search?: Ref<string>; // Add search option
  // Add other query parameters like sort, etc., as needed
}

// Type for the update payload (can be partial, adjust as needed based on API)
// Using Partial<Omit<Product, 'id' | '__typename'>> to exclude non-editable fields
type ProductUpdatePayload = Partial<Omit<Product, 'id' | '__typename'>>;

/**
 * Composable for fetching products from the API.
 *
 * @param options - Optional configuration for pagination, filtering, etc.
 * @returns The result of the useFetch call.
 */
export const useProducts = (options: UseProductsOptions = {}) => {
  const { page = ref(1), limit = ref(10), search = ref('') } = options;

  const query = computed(() => ({
    page: page.value,
    limit: limit.value,
    // Only include search query if it has a value
    ...(search.value && { search: search.value }),
    // Add other reactive query parameters here
  }));

  // Use key generation function to ensure refetching when query changes
  const getKey = () => JSON.stringify(query.value);

  return useFetch<ApiResponse<Product>>('/api/products', {
    query,
    // Use a key to automatically refetch when query (page, limit, search) changes
    key: getKey(),
    // Watch the computed query object to trigger refetch
    watch: [query],
  });
};

/**
 * Composable for fetching a single product by ID.
 *
 * @param id - The ID of the product to fetch.
 * @returns The result of the useFetch call.
 */
export const useProductById = (id: string | number | Ref<string | number>) => {
  const productId = ref(id); // Ensure reactivity if a Ref is passed

  const url = computed(() => `/api/products/${productId.value}`);

  // Assuming the single product endpoint returns just the Product object,
  // adjust the type parameter if it returns ApiResponse<Product> or similar.
  return useFetch<Product>(url, {
    // Watch the ID ref if it's dynamic (e.g., from route params)
    watch: [productId],
    // Consider setting a key for better caching/refetching
    key: `product-${productId.value}`,
  });
};

/**
 * Service function to update a product.
 *
 * @param id - The ID of the product to update.
 * @param payload - The data to update.
 * @returns A promise resolving when the update is complete.
 */
export const updateProduct = async (id: string | number, payload: ProductUpdatePayload): Promise<void> => {
  try {
    await $fetch(`/api/products/${id}`, {
      method: 'PUT',
      body: payload,
    });
    // Optionally, handle cache invalidation here if needed
    // For example, invalidate the specific product cache tag:
    // await invalidateNuxtData(`product-${id}`);
    // Or invalidate the list if changes affect it:
    // await invalidateNuxtData((key) => key?.startsWith('/api/products'));

  } catch (error) {
    console.error('Error updating product:', error);
    // Rethrow or handle the error more specifically (e.g., return error details)
    // Consider wrapping $fetch errors for better handling upstream
    throw error; // Rethrow for the component to catch
  }
};