import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import OrderStatus from './models/OrderStatus.js';
import ProductStatus from './models/ProductStatus.js';
import Category from './models/Category.js';
import Address from './models/Address.js';
import User from './models/User.js';
import Supplier from './models/Supplier.js';
import Product from './models/Product.js';
import Review from './models/Review.js';
import { productStatuses as product_stat, orderStatuses as order_stat, categoryNames } from '../constants/inputVars.js';

async function seedDatabase() {
  // =================== 1. Seed order statuses ===================
  const orderStatuses = [];
  for (let name of order_stat) {
    const status = await OrderStatus.create({ id: uuidv4(), name });
    orderStatuses.push(status);
  }

  // =================== 2. Seed product statuses ===================
  const productStatuses = [];
  for (let name of product_stat) {
    const status = await ProductStatus.create({ id: uuidv4(), name });
    productStatuses.push(status);
  }

  // =================== 3. Seed categories ===================
  const categories = [];
  for (let name of categoryNames) {
    const category = await Category.create({ id: uuidv4(), name });
    categories.push(category);
  }

  // =================== 4. Seed addresses (UK) ===================
  const addresses = [];
  for (let i = 0; i < 6; i++) {
    const address = await Address.create({
      id: uuidv4(),
      street: faker.location.street(),
      city: faker.location.city('en-GB'), // UK city
      apartment: faker.helpers.arrayElement([faker.location.buildingNumber(), null]),
    });
    addresses.push(address);
  }

  // =================== 5. Seed users ===================
  const users = [];
  for (let i = 0; i < 6; i++) {
    const user = await User.create({
      id: uuidv4(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phoneNumber: faker.phone.number(),
      avatarUrl: faker.image.avatar(),
      address_id: faker.helpers.arrayElement(addresses).id,
    });
    users.push(user);
  }

  // =================== 6. Seed suppliers ===================
  const suppliers = [];
  for (let i = 0; i < 6; i++) {
    const supplier = await Supplier.create({
      id: uuidv4(),
      name: faker.company.name(),
      company: faker.company.name(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      address_id: faker.helpers.arrayElement(addresses).id,
    });
    suppliers.push(supplier);
  }

  // =================== 7. Seed products ===================
const productTypes = ['Vitamin', 'Syrup', 'Tablet', 'Capsule', 'Cream', 'Spray', 'Gel'];
const productAdjectives = ['Strong', 'Quick', 'Daily', 'Extra', 'Children', 'Adult'];
const products = [];

for (let category of categories) {
  for (let i = 0; i < 5; i++) {
    // 5 products per category
    const name = `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} ${category.name}`;

    const product = await Product.create({
      id: uuidv4(),
      name,
      description: faker.lorem.sentences(2),
      price: faker.commerce.price({ min: 5, max: 50, dec: 2 }),
      quantity: faker.number.int({ min: 1, max: 100 }),
      image_url: `https://picsum.photos/320/240?random=${Math.floor(Math.random() * 10000)}`,
      supplier_id: faker.helpers.arrayElement(suppliers).id,
      category_id: category.id,
      status_id: faker.helpers.arrayElement(productStatuses).id,
    });
    products.push(product);
  }
}

  // =================== 8. Seed reviews ===================
  const reviews = [];
  for (let i = 0; i < 10; i++) {
    const review = await Review.create({
      id: uuidv4(),
      content: faker.lorem.sentences(),
      rating: faker.number.int({ min: 1, max: 10 }),
      product_id: faker.helpers.arrayElement(products).id,
      user_id: faker.helpers.arrayElement(users).id,
    });
    reviews.push(review);
  }

  console.log('Database seeded successfully!');
}

export default seedDatabase;
