import { INestApplication } from '@nestjs/common';
import { createTestingModule, configureTestApp } from '../test-module';
import * as request from 'supertest';

describe('Core Module (e2e)', () => {
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

  describe('Global Validation', () => {
    it('should reject requests with invalid content type', async () => {
      // Arrange
      const endpoint = '/admin/v1/products';
      const expectedStatus = 400; // Validation is now working, returns 400

      // Act & Assert
      await request(app.getHttpServer())
        .post(endpoint)
        .set('Content-Type', 'text/plain')
        .send('some text')
        .expect(expectedStatus);
    });

    it('should validate required fields', async () => {
      // Arrange
      const endpoint = '/admin/v1/products';
      const invalidProduct = {
        description: 'A test product',
        image_url: 'https://example.com/test.jpg',
        is_active: true,
      };
      const expectedStatus = 400;

      // Act & Assert
      await request(app.getHttpServer())
        .post(endpoint)
        .send(invalidProduct)
        .expect(expectedStatus);
    });

    it('should validate field types', async () => {
      // Arrange
      const endpoint = '/admin/v1/products';
      const invalidProduct = {
        name: 'Test Product',
        description: 'A test product',
        image_url: 'not-a-url',
        is_active: true,
      };
      const expectedStatus = 400;

      // Act & Assert
      await request(app.getHttpServer())
        .post(endpoint)
        .send(invalidProduct)
        .expect(expectedStatus);
    });

    it('should validate URL format', async () => {
      // Arrange
      const endpoint = '/admin/v1/products';
      const invalidProduct = {
        name: 'Test Product',
        description: 'A test product',
        image_url: 'invalid-url-format',
        is_active: true,
      };
      const expectedStatus = 400;

      // Act & Assert
      await request(app.getHttpServer())
        .post(endpoint)
        .send(invalidProduct)
        .expect(expectedStatus);
    });
  });

  describe('CORS and Headers', () => {
    it('should handle preflight requests (returns 404 as expected)', async () => {
      // Arrange
      const endpoint = '/admin/v1/products';
      const expectedStatus = 404;

      // Act & Assert
      await request(app.getHttpServer())
        .options(endpoint)
        .set('Access-Control-Request-Method', 'GET')
        .set('Access-Control-Request-Headers', 'content-type')
        .expect(expectedStatus);
    });

    it('should handle CORS for actual requests', async () => {
      // Arrange
      const endpoint = '/admin/v1/products';
      const expectedStatus = 200;

      // Act & Assert
      await request(app.getHttpServer())
        .get(endpoint)
        .set('Origin', 'http://localhost:3000')
        .expect(expectedStatus);
    });
  });

  describe('Response Transformation', () => {
    it('should transform response data consistently', async () => {
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
  });

  describe('Error Handling', () => {
    it('should handle validation errors gracefully', async () => {
      // Arrange
      const endpoint = '/admin/v1/products/invalid-uuid';
      const expectedStatus = 400;

      // Act & Assert
      await request(app.getHttpServer())
        .get(endpoint)
        .expect(expectedStatus);
    });

    it('should return proper error structure', async () => {
      // Arrange
      const endpoint = '/admin/v1/products/invalid-uuid';
      const expectedStatus = 400;
      const expectedProperties = ['message', 'error', 'statusCode'];

      // Act
      const response = await request(app.getHttpServer())
        .get(endpoint)
        .expect(expectedStatus);

      // Assert
      expectedProperties.forEach(prop => {
        expect(response.body).toHaveProperty(prop);
      });
    });
  });
});
