import { v4 as uuidv4 } from 'uuid';
import ProductStatus from './models/ProductStatus.js';
import Category from './models/Category.js';
import Address from './models/Address.js';
import User from './models/User.js';
import Supplier from './models/Supplier.js';
import Product from './models/Product.js';
import Review from './models/Review.js';
import { productStatuses as product_stat, categoryNames } from '../constants/inputVars.js';
import ZipCode from './models/ZipCode.js';

/**
 * Seeds the database with initial sample data for testing or development.
 *
 * This function performs the following operations in order:
 * 1. Creates predefined order statuses.
 * 2. Creates predefined product statuses.
 * 3. Creates product categories.
 * 4. Generates random addresses (UK-based).
 * 5. Generates random users associated with addresses.
 * 6. Generates random suppliers associated with addresses.
 * 7. Generates products for each category, linking to suppliers and statuses.
 * 8. Generates random product reviews from users.
 *
 * @async
 * @function
 * @returns {Promise<void>} Resolves when all data has been seeded.
 *
 * @throws {Error} If any create operation in the database fails.
 *
 * @usage
 * await seedDatabase();
 */
async function seedDatabase() {
  // Check if we should seed data - only in development
  if (process.env.NODE_ENV === 'production') {
    console.log('Skipping database seeding in production environment');
    return;
  }

  // Try to import faker dynamically
  let faker;
  try {
    const fakerModule = await import('@faker-js/faker');
    faker = fakerModule.faker;
  } catch (error) {
    console.log('Faker not available, skipping seeding...');
    return;
  }
  // =================== 1. Seed product statuses ===================
  const productStatuses = [];
  for (let name of product_stat) {
    const status = await ProductStatus.create({ id: uuidv4(), name });
    productStatuses.push(status);
  }

  // =================== 2. Seed categories ===================
  const categories = [];
  for (let name of categoryNames) {
    const category = await Category.create({ id: uuidv4(), name });
    categories.push(category);
  }

  // =================== 3. Seed zip codes (UK) ===================
  const zipCodes = [];
  const sampleZipCodes = ['SW1A 1AA', 'EC1A 1BB', 'W1A 0AX', 'M1 1AE', 'B33 8TH', 'CR2 6XH'];

  for (let code of sampleZipCodes) {
    const zip = await ZipCode.create({
      id: uuidv4(),
      code,
      city: faker.location.city('en-GB'),
      region: faker.location.state('en-GB'),
      country: 'UK',
    });
    zipCodes.push(zip);
  }

  // =================== 4. Seed addresses ===================
  const addresses = [];
  for (let i = 0; i < 6; i++) {
    const address = await Address.create({
      id: uuidv4(),
      street: faker.location.street(),
      apartment: faker.helpers.arrayElement([faker.location.buildingNumber(), null]),
      zip_code_id: faker.helpers.arrayElement(zipCodes).id,
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
      phoneNumber: faker.phone.number({ style: 'national' }),
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
      phone: faker.phone.number({ style: 'national' }),
      email: faker.internet.email(),
      address_id: faker.helpers.arrayElement(addresses).id,
    });
    suppliers.push(supplier);
  }

  // =================== 7. Seed products ===================
  const products = [];
  for (let category of categories) {
    for (let i = 0; i < 5; i++) {
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
      rating: faker.number.int({ min: 1, max: 5 }),
      product_id: faker.helpers.arrayElement(products).id,
      user_id: faker.helpers.arrayElement(users).id,
    });
    reviews.push(review);
  }

  console.log('Database seeded successfully!');
}

export default seedDatabase;