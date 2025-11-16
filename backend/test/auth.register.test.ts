import request from "supertest";
import app from "../src/app";
import { PrismaClient } from "@prisma/client";

const prisma=new PrismaClient();

describe("user registration api", () => {
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
  });

  // disconnect prisma after tests
  afterAll(async () => {
    await prisma.$disconnect();
    await server.close();
  });

  // test1: successful registration
  it("should register a new user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(userData.email);
  });

  // test2: prevent duplicate email registration
  it("should not allow registering with the same email twice", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/email already exists/i);
  });

  // test3: missing required fields
  it("should fail if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "noName@example.com" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/name.*required/i);
  });

  // test4: invalid email format
  it("should fail if email format is invalid", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Invalid Email",
        email: "not-an-email",
        password: "Password123",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid email/i);
  });

  // test5: weak password
  it("should fail if password is too weak", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Weak Password",
        email: "weak@example.com",
        password: "123",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/password/i);
  });
});