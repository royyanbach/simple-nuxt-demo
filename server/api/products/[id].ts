import { defineEventHandler, createError, getRouterParam } from 'h3';
import { products } from '../products';

const getProductById = defineEventHandler((event) => {
  const idParam = getRouterParam(event, 'id');
  if (!idParam) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required',
    });
  }

  const id = parseInt(idParam);
  const product = products.find(p => p.id === id);

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    });
  }

  return product;
});

const updateProduct = defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id');
  if (!idParam) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required',
    });
  }

  const id = parseInt(idParam);
  const body = await readBody(event);

  const index = products.findIndex(p => p.id === id)
  if (index === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    });
  }

  const updatedProduct = {
    ...products[index],
    ...body,
    id,
  };

  products[index] = updatedProduct;
  return updatedProduct;
});

const deleteProduct = defineEventHandler((event) => {
  const idParam = getRouterParam(event, 'id');
  if (!idParam) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required',
    });
  }

  const id = parseInt(idParam);

  const index = products.findIndex(p => p.id === id)
  if (index === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    });
  }

  const deletedProduct = products[index];
  products.splice(index, 1);

  return {
    message: 'Product deleted successfully',
    product: deletedProduct,
  };
});

export default defineEventHandler((event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    return getProductById(event);
  }

  if (method === 'PUT') {
    return updateProduct(event);
  }

  if (method === 'DELETE') {
    return deleteProduct(event);
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method Not Allowed',
  })
})