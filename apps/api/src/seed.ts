import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Organization } from './entities/organization.entity';
import { Task } from './entities/task.entity';
import { Role } from '../../../libs/data/src/lib/role.enum';
import { TaskStatus } from '../../../libs/data/src/lib/task.types';


const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Task, Organization],
  synchronize: true,
});

async function run() {
  await ds.initialize();
  console.log('🌱 Seeding database...');

  const orgRepo = ds.getRepository(Organization);
  const userRepo = ds.getRepository(User);
  const taskRepo = ds.getRepository(Task);

  // --- Organizations ---
  const parent = await orgRepo.save(
    orgRepo.create({ name: 'Org A' } as Partial<Organization>)
  );

  const child = await orgRepo.save(
    orgRepo.create({ name: 'Org B', parent } as Partial<Organization>)
  );

  // --- Users ---
  const owner = await userRepo.save(
    userRepo.create({
      email: 'owner@orga.com',
      passwordHash: await bcrypt.hash('owner1234', 10),
      org: parent,
      role: Role.OWNER,
    } as Partial<User>)
  );

  const admin = await userRepo.save(
    userRepo.create({
      email: 'admin@orga.com',
      passwordHash: await bcrypt.hash('admin1234', 10),
      org: parent,
      role: Role.ADMIN,
    } as Partial<User>)
  );

  const viewer = await userRepo.save(
    userRepo.create({
      email: 'viewer@orgb.com',
      passwordHash: await bcrypt.hash('viewer1234', 10),
      org: child,
      role: Role.VIEWER,
    } as Partial<User>)
  );

  // --- Tasks ---
  await taskRepo.save(
  taskRepo.create({
    title: 'Design RBAC',
    category: 'Work',
    status: TaskStatus.TODO,
    org: parent,
    createdBy: owner,
  } as Partial<Task>)
);

await taskRepo.save(
  taskRepo.create({
    title: 'Write tests',
    category: 'Work',
    status: TaskStatus.IN_PROGRESS,
    org: parent,
    createdBy: admin,
  } as Partial<Task>)
);

await taskRepo.save(
  taskRepo.create({
    title: 'Deploy MVP',
    category: 'Work',
    status: TaskStatus.DONE,
    org: parent,
    createdBy: admin,
  } as Partial<Task>)
);

await taskRepo.save(
  taskRepo.create({
    title: 'Personal task',
    category: 'Personal',
    status: TaskStatus.TODO,
    org: child,
    createdBy: viewer,
  } as Partial<Task>)
);


  console.log('✅ Seeding complete.');
  await ds.destroy();
}

run().catch((e) => {
  console.error('❌ Seeding failed:', e);
  process.exit(1);
});
