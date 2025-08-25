const { DataSource } = require('typeorm');
const path = require('path');

module.exports = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'lemonade_user',
  password: 'lemonade_password',
  database: 'lemonade',
  entities: [path.join(__dirname, 'src/**/*.entity.ts')],
  migrations: [path.join(__dirname, 'src/migrations/*.js')],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: true,
});
