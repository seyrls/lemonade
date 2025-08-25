import { INestApplication } from '@nestjs/common';
import { createTestingModule, configureTestApp } from '../../test-module';
import * as request from 'supertest';

describe('ProductVariantsController (e2e)', () => {
  let app: INestApplication;
  let productId: string;
  let variantId: string;

  beforeAll(async () => {
    const moduleFixture = await createTestingModule();
    app = moduleFixture.createNestApplication();
    configureTestApp(app);
    await app.init();

    // Create a product first to use for product-variant tests
    const createProductDto = {
      name: 'Test Product for Variants',
      description: 'A test product for variant testing',
      image_url: 'https://example.com/test.jpg',
      is_active: true,
    };

    const productResponse = await request(app.getHttpServer())
      .post('/admin/v1/products')
      .send(createProductDto);

    productId = productResponse.body.id;

    // Create a variant first to use for product-variant tests
    const createVariantDto = {
      name: 'Test Variant for Product',
      is_active: true,
    };

    const variantResponse = await request(app.getHttpServer())
      .post('/admin/v1/variants')
      .send(createVariantDto);

    variantId = variantResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /admin/v1/products/:productId/variants', () => {
    it('should create a new product variant', async () => {
      // Arrange
      const endpoint = `/admin/v1/products/${productId}/variants`;
      const createProductVariantDto = [
        {
          variant_id: variantId,
          price: 29.99,
          is_active: true,
        },
      ];
      const expectedStatus = 201;
      const expectedProperties = ['id', 'product_id', 'variant_id', 'price', 'is_active'];

      // Act
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send(createProductVariantDto)
        .expect(expectedStatus);

      // Assert
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      
      const createdProductVariant = response.body[0];
      expectedProperties.forEach(prop => {
        expect(createdProductVariant).toHaveProperty(prop);
      });
    });
  });

  describe('PATCH /admin/v1/products/:productId/variants/:id', () => {
    it('should return 400 for invalid UUID', async () => {
      // Arrange
      const invalidId = 'invalid-uuid';
      const endpoint = `/admin/v1/products/${productId}/variants/${invalidId}`;
      const updateData = { price: 39.99 };
      const expectedStatus = 400;

      // Act & Assert
      await request(app.getHttpServer())
        .patch(endpoint)
        .send(updateData)
        .expect(expectedStatus);
    });

    it('should return 404 for invalid product id', async () => {
      // Arrange
      const validId = '00000000-0000-0000-0000-000000000000';
      const endpoint = `/admin/v1/products/${productId}/variants/${validId}`;
      const invalidUpdateData = { price: 'invalid-price' };
      const expectedStatus = 404;

      // Act & Assert
      await request(app.getHttpServer())
        .patch(endpoint)
        .send(invalidUpdateData)
        .expect(expectedStatus);
    });
  });

  describe('DELETE /admin/v1/products/:productId/variants/:id', () => {
    it('should return 400 for invalid UUID', async () => {
      // Arrange
      const invalidId = 'invalid-uuid';
      const endpoint = `/admin/v1/products/${productId}/variants/${invalidId}`;
      const expectedStatus = 400;

      // Act & Assert
      await request(app.getHttpServer())
        .delete(endpoint)
        .expect(expectedStatus);
    });
  });
});
