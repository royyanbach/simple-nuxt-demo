import { defineEventHandler, readBody, createError, getQuery } from 'h3'
import type { H3Event } from 'h3'
import mockProducts from './products.mock.json'

export const products = [...mockProducts.products];

const requiredFields = [
  'gvtId',
  'name',
  'productTagline',
  'shortDescription',
  'longDescription',
  'productUrl',
  'voucherTypeName',
  'orderUrl',
  'productTitle',
];

const getProducts = (event: H3Event) => {
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const search = (query.search as string) || '';

  let filteredProducts = products;
  if (search) {
    filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedProducts = {
    data: filteredProducts.slice(startIndex, endIndex),
    pagination: {
      total: filteredProducts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProducts.length / limit)
    }
  };

  return paginatedProducts;
};

const createProduct = async (event: H3Event) => {
  const body = await readBody(event);

  if (!requiredFields.every(field => body[field])) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields'
    });
  }

  const maxId = products.reduce((max, product) => Math.max(max, product.id), 0);
  const newProduct = {
    id: maxId + 1,
    ...body
  };

  products.push(newProduct);
  return newProduct;
};

export default defineEventHandler((event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    return getProducts(event);
  }

  if (method === 'POST') {
    return createProduct(event);
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method Not Allowed'
  });
});
