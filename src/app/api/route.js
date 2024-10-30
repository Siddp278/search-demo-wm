// src/app/api/route.js
import { faker } from '@faker-js/faker';

export async function GET(req) {
  const { searchParams } = new URL(req.url); 
  const page = searchParams.get('page') || '1'; 
  const pageNum = parseInt(page);
  const itemsPerPage = 10;

  // Generate a list of items
  const items = Array.from({ length: itemsPerPage }, () => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    image: faker.image.urlPicsumPhotos({ width: 200, height: 200, grayscale: false, blur: 0 }),
  }));

  // console.log(items); 
  return new Response(JSON.stringify({ items }), { status: 200 }); 
}

