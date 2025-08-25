import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { entities } from '../src/entities';

// Global test configuration
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_NAME = 'lemonade_test';
  
  // Increase timeout for e2e tests
  jest.setTimeout(30000);
});

// Global test utilities
export async function createTestingApp(): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [
      AppModule,
    ],
  }).compile();
}

export async function createTestingAppWithDatabase(): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [
      AppModule,
    ],
  }).compile();
}

// Test database utilities
export const testDatabaseConfig = {
  type: 'postgres' as const,
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'lemonade_user',
  password: process.env.DATABASE_PASSWORD || 'lemonade_password',
  database: process.env.DATABASE_NAME || 'lemonade_test',
  entities: entities,
  synchronize: true,
  logging: false,
  dropSchema: true, // Drop schema before each test run
};

// Test data utilities
export const createTestProduct = () => ({
  name: 'Test Product',
  description: 'A test product for e2e testing',
  image_url: 'https://example.com/test.jpg',
  is_active: true,
});

export const createTestVariant = () => ({
  name: 'Test Variant',
  is_active: true,
});

export const createTestUser = () => ({
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Test User',
  email: 'test@example.com',
  phone_number: '+1234567890',
  created_at: new Date(),
  updated_at: new Date(),
});

export const createTestOrder = (customerId: string, productVariantId: string) => ({
  customer_id: customerId,
  items: [
    {
      product_variant_id: productVariantId,
      quantity: 1,
    },
  ],
});

// Cleanup utilities
export const cleanupTestData = async () => {
  // This would be implemented based on your specific cleanup needs
  // For now, we rely on the dropSchema: true option in test database config
};

// Error handling utilities
export const expectValidationError = (response: any, field: string) => {
  expect(response.status).toBe(400);
  expect(response.body.message).toContain(field);
};

export const expectNotFoundError = (response: any) => {
  expect(response.status).toBe(404);
  expect(response.body.message).toBeDefined();
};

export const expectUnauthorizedError = (response: any) => {
  expect(response.status).toBe(401);
  expect(response.body.message).toBeDefined();
};

// Response validation utilities
export const validateProductResponse = (product: any) => {
  expect(product).toHaveProperty('id');
  expect(product).toHaveProperty('name');
  expect(product).toHaveProperty('description');
  expect(product).toHaveProperty('image_url');
  expect(product).toHaveProperty('is_active');
  expect(product).toHaveProperty('created_at');
  expect(product).toHaveProperty('updated_at');
};

export const validateVariantResponse = (variant: any) => {
  expect(variant).toHaveProperty('id');
  expect(variant).toHaveProperty('name');
  expect(variant).toHaveProperty('is_active');
  expect(variant).toHaveProperty('created_at');
  expect(variant).toHaveProperty('updated_at');
};

export const validateOrderResponse = (order: any) => {
  expect(order).toHaveProperty('id');
  expect(order).toHaveProperty('confirmation_number');
  expect(order).toHaveProperty('customer');
  expect(order).toHaveProperty('items');
  expect(order).toHaveProperty('total_price');
  expect(order).toHaveProperty('status');
  expect(order).toHaveProperty('created_at');
};

// Test constants
export const TEST_TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
};

export const TEST_IDS = {
  NON_EXISTENT_PRODUCT: '00000000-0000-0000-0000-000000000000',
  NON_EXISTENT_VARIANT: '00000000-0000-0000-0000-000000000000',
  NON_EXISTENT_ORDER: 999999,
  TEST_USER: '00000000-0000-0000-0000-000000000001',
};
