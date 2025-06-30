
import { DataSource } from 'typeorm';
import { User } from './user.entity';
import ormconfig from '../../ormconfig';

const seed = async () => {
  const dataSource = await ormconfig.initialize();
  const repo = dataSource.getRepository(User);

  for (let i = 1; i <= 100; i++) {
    const user = repo.create({ name: `User${i}` });
    await repo.save(user);
  }
  console.log('100 users seeded.');
  await dataSource.destroy();
};

seed();
