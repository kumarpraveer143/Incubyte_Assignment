import request from "supertest";
import app from "../src/app";
import { PrismaClient } from "@prisma/client";

const prisma=new PrismaClient();

describe("User Login API", () => {
  const userData = {
    name: "user1",
    email: "user1@example.com",
    password: "PassworD@1",
  };

  let server:any;

  // clean db before tests
  beforeAll(async () => {
    await prisma.purchase.deleteMany();
    await prisma.restockLog.deleteMany();
    await prisma.sweet.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    server=app.listen(3000,()=>{});
    // Register a test user to login with
    await request(app)
      .post("/api/auth/register")
      .send(userData);
  });

  // disconnect prisma after tests
  afterAll(async () => {
    await prisma.$disconnect();
    await server.close();
  });

  // test1: successful login
  it("should login successfully with correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(userData.email);
  });

  // test2: wrong password
  it("should fail login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: "wrongpass" });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  // test3: email not exist
  it("should fail login with non-existent email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "notfound@example.com", password: "StrongPass123" });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials|not found/i);
  });

  // test4: missing fields
  it("should fail login if email or password is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/password.*required/i);
  });

  // test5: invalid email format
  it("should fail login if email is not valid format", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "not-an-email", password: "Password123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid email/i);
  });
});