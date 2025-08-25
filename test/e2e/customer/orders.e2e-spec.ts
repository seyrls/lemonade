import { INestApplication } from '@nestjs/common';
import { configureTestApp, createTestingModuleWithDataSource } from '../../test-module';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { User } from '../../../src/entities/user.entity';
import { Product } from '../../../src/entities/product.entity';
import { Variant } from '../../../src/entities/variant.entity';
import { ProductVariant } from '../../../src/entities/product-variant.entity';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let testUser: User;
  let testProduct: Product;
  let testVariant: Variant;
  let testProductVariant: ProductVariant;

  beforeAll(async () => {
    const { module, dataSource: ds } = await createTestingModuleWithDataSource();
    dataSource = ds;
    app = module.createNestApplication();
    configureTestApp(app);
    await app.init();

    await setupTestData();
  });

  afterAll(async () => {
    await app.close();
  });

  async function setupTestData() {
    testUser = dataSource.getRepository(User).create({
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Test User',
      email: 'test@example.com',
      phone_number: '+1234567890',
    });
    testUser = await dataSource.getRepository(User).save(testUser);

    testProduct = dataSource.getRepository(Product).create({
      name: 'Test Product',
      description: 'A test product for e2e testing',
      image_url: 'https://example.com/test.jpg',
      is_active: true,
    });
    testProduct = await dataSource.getRepository(Product).save(testProduct);

    testVariant = dataSource.getRepository(Variant).create({
      name: 'Test Variant',
      is_active: true,
    });
    testVariant = await dataSource.getRepository(Variant).save(testVariant);

    testProductVariant = dataSource.getRepository(ProductVariant).create({
      product_id: testProduct.id,
      variant_id: testVariant.id,
      price: 29.99,
      is_active: true,
    });
    testProductVariant = await dataSource.getRepository(ProductVariant).save(testProductVariant);
  }

  describe('GET /customer/v1/orders/:confirmation_number', () => {
    it('should return 404 for invalid confirmation number', async () => {
      // Arrange
      const invalidConfirmation = -1;
      const endpoint = `/customer/v1/orders/${invalidConfirmation}`;
      const expectedStatus = 404;

      // Act & Assert
      await request(app.getHttpServer())
        .get(endpoint)
        .expect(expectedStatus);
    });

    it('should return 404 for non-existent confirmation number', async () => {
      // Arrange
      const nonExistentConfirmation = 999999;
      const endpoint = `/customer/v1/orders/${nonExistentConfirmation}`;
      const expectedStatus = 404;

      // Act & Assert
      await request(app.getHttpServer())
        .get(endpoint)
        .expect(expectedStatus);
    });
  });

  describe('POST /customer/v1/orders', () => {
    it('should create a new order', async () => {
      // Arrange
      const endpoint = '/customer/v1/orders';
      const createOrderDto = {
        customer_id: testUser.id,
        items: [
          {
            product_variant_id: testProductVariant.id,
            quantity: 2,
          },
        ],
      };
      const expectedStatus = 201;
      const expectedProperties = ['id', 'user_id', 'total_price', 'status', 'confirmation_number'];

      // Act
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send(createOrderDto)
        .expect(expectedStatus);

      // Assert
      expectedProperties.forEach(prop => {
        expect(response.body).toHaveProperty(prop);
      });
      expect(response.body.user_id).toBe(createOrderDto.customer_id);
      expect(response.body.items).toHaveLength(createOrderDto.items.length);
    });

    it('should return 400 for invalid order data', async () => {
      // Arrange
      const endpoint = '/customer/v1/orders';
      const invalidOrder = {
        customer_id: 'invalid-uuid',
        items: [
          {
            product_variant_id: '00000000-0000-0000-0000-000000000000',
            quantity: -1,
          },
        ],
      };
      const expectedStatus = 400;

      // Act & Assert
      await request(app.getHttpServer())
        .post(endpoint)
        .send(invalidOrder)
        .expect(expectedStatus);
    });

    it('should return 400 for missing required fields', async () => {
      // Arrange
      const endpoint = '/customer/v1/orders';
      const incompleteOrder = {
        items: [
          {
            product_variant_id: '00000000-0000-0000-0000-000000000000',
            quantity: 1,
          },
        ],
      };
      const expectedStatus = 400;

      // Act & Assert
      await request(app.getHttpServer())
        .post(endpoint)
        .send(incompleteOrder)
        .expect(expectedStatus);
    });
  });
});
