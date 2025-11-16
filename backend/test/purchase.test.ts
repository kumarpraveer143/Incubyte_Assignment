import request from "supertest";
import app from "../src/app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Purchase API", () => {
  let server: any;
  let customerToken: string;
  let sweetId: number;

  const customerData = {
    email: "customer1@example.com",
    password: "Customer@123",
  };

  const category={
    name:"indian sweet"
  }

  const sweetData = {
    name: "Rasgulla",
    categoryId: 7,
    price: 50,
    quantity: 5,
  };

  // clean DB before tests
  beforeAll(async () => {
    await prisma.purchase.deleteMany();
    await prisma.restockLog.deleteMany();
    await prisma.sweet.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    server = app.listen(3002, () => {});

    // register customer
    await request(app).post("/api/auth/register").send({
      name: "customer1",
      email: customerData.email,
      password: customerData.password,
      role: "CUSTOMER",
    });

    // login customer to get token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: customerData.email,
      password: customerData.password,
    });
    customerToken = loginRes.body.token;

    const categoryRes = await prisma.category.create({data: category});
    sweetData.categoryId=categoryRes.id;
    const sweetRes = await prisma.sweet.create({data: sweetData});
    sweetId = sweetRes.id;
  });

  // disconnect prisma and close server after tests
  afterAll(async () => {
    await prisma.$disconnect();
    await server.close();
  });

  // test1: successful purchase
  it("should allow customer to purchase sweet with valid quantity", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ quantity: 2 });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/purchase successful/i);
    expect(res.body.purchase.quantity).toBe(2);
  });

  // test2: prevent purchase if stock = 0
  it("should not allow purchase if stock is 0", async () => {
    await prisma.sweet.update({
      where: { id: sweetId },
      data: { quantity: 0 },
    });

    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ quantity: 1 });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/out of stock/i);
  });

  // test3: prevent purchase if quantity > stock
  it("should not allow purchase if requested quantity exceeds stock", async () => {
    await prisma.sweet.update({
      where: { id: sweetId },
      data: { quantity: 3 },
    });

    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/insufficient stock/i);
  });

  // test4: fail purchase without token
  it("should not allow purchase without token", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .send({ quantity: 1 });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/unauthorized/i);
  });

  // test5: fail purchase with invalid sweet ID
  it("should return 404 if sweet not found", async () => {
    const res = await request(app)
      .post(`/api/sweets/1223234343434343/purchase`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ quantity: 1 });

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/sweet not found/i);
  });
});