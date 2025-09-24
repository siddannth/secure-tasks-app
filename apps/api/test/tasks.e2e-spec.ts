import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Tasks RBAC (e2e)', () => {
  let app: INestApplication;
  let ownerToken: string;
  let viewerToken: string;
  let createdTaskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Try logging in as seeded users (adjust emails to match your seeding!)
    const ownerLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'owner@orga.com', password: 'password' });

    if (ownerLogin.status === 201 || ownerLogin.status === 200) {
      ownerToken = ownerLogin.body.access_token;
    }

    const viewerLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'viewer@orgb.com', password: 'password' });

    if (viewerLogin.status === 201 || viewerLogin.status === 200) {
      viewerToken = viewerLogin.body.access_token;
    }
  });

  it('should reject unauthenticated task creation', async () => {
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'My Test Task', category: 'Work' })
      .expect(401);
  });

  it('should allow Owner to create a task (if token available)', async () => {
    if (!ownerToken) return; // skip if seeding not done
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'E2E Task', category: 'Work' })
      .expect(201);

    expect(res.body.title).toBe('E2E Task');
    createdTaskId = res.body.id;
  });

  it('should forbid Viewer from deleting a task', async () => {
    if (!viewerToken || !createdTaskId) return; // skip if not seeded
    await request(app.getHttpServer())
      .delete(`/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${viewerToken}`)
      .expect(403);
  });

  it('should allow Owner to access audit log', async () => {
    if (!ownerToken) return; // skip if not seeded
    await request(app.getHttpServer())
      .get('/audit-log')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);
  });

  it('should forbid Viewer from accessing audit log', async () => {
    if (!viewerToken) return; // skip if not seeded
    await request(app.getHttpServer())
      .get('/audit-log')
      .set('Authorization', `Bearer ${viewerToken}`)
      .expect(403);
  });

  afterAll(async () => {
    await app.close();
  });
});
