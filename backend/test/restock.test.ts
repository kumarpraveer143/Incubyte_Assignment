import request from "supertest";
import app from "../src/app";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

describe("Inventory Restock API", () => {
  let server: any;
  let adminToken: string;
  let sweetId: number;

  const adminData = {
    email: "user1@example.com",
    password: "PassworD@1",
  };

  const category={
    name:"indian sweet"
  }

  const sweetData = {
    name: "Gulab Jamun",
    categoryId: 1,
    price: 100,
    quantity:0
  };

  // clean DB before tests
  beforeAll(async () => {
    await prisma.purchase.deleteMany();
    await prisma.restockLog.deleteMany();
    await prisma.sweet.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    server = app.listen(3003, () => {});

    const password=await bcrypt.hash(adminData.password,10);
    await prisma.user.create({data:{name:"user1",password,email:adminData.email,role:"ADMIN"}});

    const loginRes = await request(app).post("/api/auth/login")
    .send({email: adminData.email,password: adminData.password,});
    adminToken = loginRes.body.token;

    const categoryRes= await prisma.category.create({data:category});
    sweetData.categoryId=categoryRes.id;

    const sweetRes = await prisma.sweet.create({data:sweetData});
    sweetId = sweetRes.id;
  });

  // disconnect prisma and close server after tests
  afterAll(async () => {
    await prisma.$disconnect();
    await server.close();
  });

  // test1: admin can restock sweet
  it("should allow admin to restock sweet", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/restocked successfully/i);
    expect(res.body.sweet.quantity).toBe(sweetData.quantity + 5);
  });

  // test2: fail restock with invalid sweet id
  it("should return 404 if sweet not found", async () => {
    const res = await request(app)
      .post(`/api/sweets/1239893/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/sweet not found/i);
  });

  // test3: fail restock without token
  it("should not allow restock without token", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .send({ quantity: 5 });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/unauthorized/i);
  });

  // test4: fail restock if user is not admin
  it("should not allow customer to restock", async () => {
    // register customer
    await request(app).post("/api/auth/register").send({
      name: "customer1",
      email: "customer1@example.com",
      password: "Customer@123",
      role: "CUSTOMER",
    });

    // login customer
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "customer1@example.com",
      password: "Customer@123",
    });
    const customerToken = loginRes.body.token;

    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ quantity: 3 });

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/not authorized/i);
  });

  // test5: fail restock with invalid quantity
  it("should not allow restock with invalid quantity", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: -5 });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid quantity/i);
  });
});