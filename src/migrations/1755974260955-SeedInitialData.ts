import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialData1755974260955 implements MigrationInterface {
  name = 'SeedInitialData1755974260955';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO variants (id, name, is_active, created_at, updated_at) VALUES
      (gen_random_uuid(), 'Small', true, NOW(), NOW()),
      (gen_random_uuid(), 'Medium', true, NOW(), NOW()),
      (gen_random_uuid(), 'Large', true, NOW(), NOW())
    `);

    await queryRunner.query(`
      INSERT INTO products (id, name, description, image_url, is_active, created_at, updated_at) VALUES
      (gen_random_uuid(), 'Classic Lemonade', 'Refreshing traditional lemonade made with fresh lemons', 'https://picsum.photos/400/400?random=1', true, NOW(), NOW()),
      (gen_random_uuid(), 'Strawberry Fizz', 'Bubbly strawberry soda with natural fruit flavor', 'https://picsum.photos/400/400?random=2', true, NOW(), NOW()),
      (gen_random_uuid(), 'Iced Tea', 'Smooth iced tea with a hint of citrus', 'https://picsum.photos/400/400?random=3', true, NOW(), NOW())
    `);

    const variants = await queryRunner.query('SELECT id, name FROM variants ORDER BY name');
    const products = await queryRunner.query('SELECT id, name FROM products ORDER BY name');

    const sizePrices = {
      'Small': 2.00,
      'Medium': 3.00,
      'Large': 4.00,
    };

    for (const product of products) {
      for (const variant of variants) {
        const price = sizePrices[variant.name as keyof typeof sizePrices];
        
        await queryRunner.query(`
          INSERT INTO product_variants (id, product_id, variant_id, price, is_active, created_at, updated_at) VALUES
          (gen_random_uuid(), $1, $2, $3, true, NOW(), NOW())
        `, [product.id, variant.id, price]);
      }
    }

    await queryRunner.query(`
      INSERT INTO users (id, name, email, phone_number, created_at, updated_at) VALUES
      (gen_random_uuid(), 'John Doe', 'john@example.com', '+1234567890', NOW(), NOW()),
      (gen_random_uuid(), 'Jane Smith', 'jane@example.com', '+1234567891', NOW(), NOW()),
      (gen_random_uuid(), 'Bob Johnson', 'bob@example.com', '+1234567892', NOW(), NOW())
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM product_variants');
    await queryRunner.query('DELETE FROM products');
    await queryRunner.query('DELETE FROM variants');
    await queryRunner.query('DELETE FROM users');
  }
}
