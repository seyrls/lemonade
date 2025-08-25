import { DataSource } from 'typeorm';
import { entities } from '../entities';

export default new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: entities,
  synchronize: true,
  logging: false,
  dropSchema: true,
});
