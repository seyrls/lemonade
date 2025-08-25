import { INestApplication } from '@nestjs/common';
import { createTestingModule, configureTestApp } from '../../test-module';
import * as request from 'supertest';

describe('VariantsController (e2e)', () => {
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

  describe('GET /admin/v1/variants', () => {
    it('should return list of variants', async () => {
      // Arrange
      const endpoint = '/admin/v1/variants';
      const expectedStatus = 200;

      // Act
      const response = await request(app.getHttpServer())
        .get(endpoint)
        .expect(expectedStatus);

      // Assert
      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return variants with pagination', async () => {
      // Arrange
      const endpoint = '/admin/v1/variants';
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

  describe('GET /admin/v1/variants/:id', () => {
    it('should return 400 for invalid UUID', async () => {
      // Arrange
      const invalidId = 'invalid-uuid';
      const endpoint = `/admin/v1/variants/${invalidId}`;
      const expectedStatus = 400;

      // Act & Assert
      await request(app.getHttpServer())
        .get(endpoint)
        .expect(expectedStatus);
    });

    it('should return 500 for non-existent variant (service error)', async () => {
      // Arrange
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const endpoint = `/admin/v1/variants/${nonExistentId}`;
      const expectedStatus = 500;

      // Act & Assert
      await request(app.getHttpServer())
        .get(endpoint)
        .expect(expectedStatus);
    });
  });

  describe('POST /admin/v1/variants', () => {
    it('should create a new variant', async () => {
      // Arrange
      const endpoint = '/admin/v1/variants';
      const createVariantDto = {
        name: 'Test Variant',
        is_active: true,
      };
      const expectedStatus = 201;
      const expectedProperties = ['id', 'name', 'is_active'];

      // Act
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send(createVariantDto)
        .expect(expectedStatus);

      // Assert
      expectedProperties.forEach(prop => {
        expect(response.body).toHaveProperty(prop);
      });
      expect(response.body.name).toBe(createVariantDto.name);
      expect(response.body.is_active).toBe(createVariantDto.is_active);
    });

    it('should return 400 for invalid variant data', async () => {
      // Arrange
      const endpoint = '/admin/v1/variants';
      const invalidVariant = {
        name: '', // Empty name should fail validation
        is_active: 'invalid-boolean', // Invalid boolean should fail validation
      };
      const expectedStatus = 400;

      // Act & Assert
      await request(app.getHttpServer())
        .post(endpoint)
        .send(invalidVariant)
        .expect(expectedStatus);
    });

    it('should return 400 for missing required fields', async () => {
      // Arrange
      const endpoint = '/admin/v1/variants';
      const incompleteVariant = {
        is_active: true,
        // Missing name field
      };
      const expectedStatus = 400;

      // Act & Assert
      await request(app.getHttpServer())
        .post(endpoint)
        .send(incompleteVariant)
        .expect(expectedStatus);
    });
  });

  describe('PUT /admin/v1/variants/:id', () => {
    it('should return 400 for invalid UUID', async () => {
      // Arrange
      const invalidId = 'invalid-uuid';
      const endpoint = `/admin/v1/variants/${invalidId}`;
      const updateData = { name: 'Updated Variant' };
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
      const endpoint = `/admin/v1/variants/${validId}`;
      const invalidUpdateData = {
        name: '', // Empty name should fail validation
      };
      const expectedStatus = 400;

      // Act & Assert
      await request(app.getHttpServer())
        .put(endpoint)
        .send(invalidUpdateData)
        .expect(expectedStatus);
    });
  });

  describe('DELETE /admin/v1/variants/:id', () => {
    it('should return 400 for invalid UUID', async () => {
      // Arrange
      const invalidId = 'invalid-uuid';
      const endpoint = `/admin/v1/variants/${invalidId}`;
      const expectedStatus = 400;

      // Act & Assert
      await request(app.getHttpServer())
        .delete(endpoint)
        .expect(expectedStatus);
    });
  });
});
