import { INestApplication } from '@nestjs/common';
import { createTestingModule, configureTestApp } from '../../test-module';
import * as request from 'supertest';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await createTestingModule();
    app = moduleFixture.createNestApplication();
    configureTestApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /admin/v1/products', () => {
    it('should return list of products', async () => {
      // Arrange
      const endpoint = '/admin/v1/products';
      const expectedStatus = 200;

      // Act
      const response = await request(app.getHttpServer())
        .get(endpoint)
        .expect(expectedStatus);

      // Assert
      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return products with pagination', async () => {
      // Arrange
      const endpoint = '/admin/v1/products';
      const query = { page: 1, limit: 10 };
      const expectedStatus = 200;

      // Act
      const response = await request(app.getHttpServer())
        .get(endpoint)
        .query(query)
        .expect(expectedStatus);

      // Assert
      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /admin/v1/products/:id', () => {
    it('should return 400 for invalid UUID', async () => {
      // Arrange
      const invalidId = 'invalid-uuid';
      const endpoint = `/admin/v1/products/${invalidId}`;
      const expectedStatus = 400;

      // Act & Assert
      await request(app.getHttpServer())
        .get(endpoint)
        .expect(expectedStatus);
    });

    it('should return 200 for non-existent product (returns empty result)', async () => {
      // Arrange
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const endpoint = `/admin/v1/products/${nonExistentId}`;
      const expectedStatus = 200;

      // Act
      const response = await request(app.getHttpServer())
        .get(endpoint)
        .expect(expectedStatus);
      
      // Assert
      expect(response.body).toBeDefined();
    });
  });

  describe('POST /admin/v1/products', () => {
    it('should create a new product', async () => {
      // Arrange
      const endpoint = '/admin/v1/products';
      const createProductDto = {
        name: 'Test Product',
        description: 'A test product',
        image_url: 'https://example.com/test.jpg',
        is_active: true,
      };
      const expectedStatus = 201;
      const expectedProperties = ['id', 'name', 'description', 'image_url', 'is_active'];

      // Act
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send(createProductDto)
        .expect(expectedStatus);

      // Assert
      expectedProperties.forEach(prop => {
        expect(response.body).toHaveProperty(prop);
      });
      expect(response.body.name).toBe(createProductDto.name);
      expect(response.body.description).toBe(createProductDto.description);
      expect(response.body.image_url).toBe(createProductDto.image_url);
    });

    it('should return 400 for invalid product data', async () => {
      // Arrange
      const endpoint = '/admin/v1/products';
      const invalidProduct = {
        name: '', // Empty name should fail validation
        description: 'A test product',
        image_url: 'not-a-url', // Invalid URL should fail validation
        is_active: true,
      };
      const expectedStatus = 400;

      // Act & Assert
      await request(app.getHttpServer())
        .post(endpoint)
        .send(invalidProduct)
        .expect(expectedStatus);
    });

    it('should return 400 for missing required fields', async () => {
      // Arrange
      const endpoint = '/admin/v1/products';
      const incompleteProduct = {
        description: 'A test product',
        image_url: 'https://example.com/test.jpg',
        is_active: true,
        // Missing name field
      };
      const expectedStatus = 400;

      // Act & Assert
      await request(app.getHttpServer())
        .post(endpoint)
        .send(incompleteProduct)
        .expect(expectedStatus);
    });
  });

  describe('PUT /admin/v1/products/:id', () => {
    it('should return 400 for invalid UUID', async () => {
      // Arrange
      const invalidId = 'invalid-uuid';
      const endpoint = `/admin/v1/products/${invalidId}`;
      const updateData = { name: 'Updated Product' };
      const expectedStatus = 400;

      // Act & Assert
      await request(app.getHttpServer())
        .put(endpoint)
        .send(updateData)
        .expect(expectedStatus);
    });

    it('should return 400 for invalid update data', async () => {
      // Arrange
      const validId = '00000000-0000-0000-0000-000000000000';
      const endpoint = `/admin/v1/products/${validId}`;
      const invalidUpdateData = {
        name: '', // Empty name should fail validation
        image_url: 'not-a-url', // Invalid URL should fail validation
      };
      const expectedStatus = 400;

      // Act & Assert
      await request(app.getHttpServer())
        .put(endpoint)
        .send(invalidUpdateData)
        .expect(expectedStatus);
    });
  });

  describe('DELETE /admin/v1/products/:id', () => {
    it('should return 400 for invalid UUID', async () => {
      // Arrange
      const invalidId = 'invalid-uuid';
      const endpoint = `/admin/v1/products/${invalidId}`;
      const expectedStatus = 400;

      // Act & Assert
      await request(app.getHttpServer())
        .delete(endpoint)
        .expect(expectedStatus);
    });
  });
});
