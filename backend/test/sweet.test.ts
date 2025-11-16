import request from "supertest";
import app from "../src/app";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

describe("sweets CRUD API", () => {
  let server: any;
  let adminToken: string;
  let sweetId: string;

  const adminData={
    email: "user1@example.com",
    password: "PassworD@1",
  };

  const category={
    name:"indian sweet"
  }
  const sweetData ={
    name: "Kaju Katli",
    price: 250,
    categoryId:1
  }

  // clean DB before tests
  beforeAll(async () => {
    await prisma.purchase.deleteMany();
    await prisma.restockLog.deleteMany();
    await prisma.sweet.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    server = app.listen(3001, () => {});

    const password=await bcrypt.hash(adminData.password,10);
    await prisma.user.create({data:{name:"user1",password,email:adminData.email,role:"ADMIN"}});

    // login admin to get token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: adminData.email,
      password: adminData.password,
    });
    adminToken = loginRes.body.token;

    const res = await request(app)
      .post("/api/category")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(category);
    sweetData.categoryId=res.body.category.id;
  });

  // disconnect prisma and close server after tests
  afterAll(async () => {
    await prisma.$disconnect();
    await server.close();
  });

  // test1: admin can add a sweet
  it("should allow admin to add a sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(sweetData);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe(sweetData.name);
    sweetId = res.body.id; // Save sweet id for later tests
  });

  // test2: get all sweets
  it("should return a list of sweets", async () => {
    const res = await request(app).get("/api/sweets")
    .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // test3: search sweets by query params
  it("should return sweets filtered by name, category, or price", async () => {
    const res = await request(app).get(
      `/api/sweets/search?name=${sweetData.name}&category=${sweetData.categoryId}&price=${sweetData.price}`
    ).set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].name).toBe(sweetData.name);
  });

  // test4: update sweet details
  it("should allow admin to update a sweet", async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 300 });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(300);
  });

  // test5: delete sweet
  it("should allow admin to delete a sweet", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  // Negative Cases ------------------------

  // test6: non-admin cannot add sweet
  it("should not allow normal user to add a sweet", async () => {
    // register normal user
    const userRes = await request(app).post("/api/auth/register").send({
      name: "user",
      email: "user@example.com",
      password: "User@123",
      role: "CUSTOMER",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "user@example.com",
      password: "User@123",
    });

    const userToken = loginRes.body.token;

    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send(sweetData);

    expect(res.status).toBe(403); // Forbidden
    expect(res.body.message).toMatch(/not authorized/i);
  });

  // test7: fail update with invalid ID
  it("should return 404 if sweet not found on update", async () => {
    const res = await request(app)
      .put(`/api/sweets/1`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 400 });

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  // test8: fail delete with invalid ID
  it("should return 404 if sweet not found on delete", async () => {
    const res = await request(app)
      .delete(`/api/sweets/1`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  // test9: fail add sweet without token
  it("should not allow adding sweet without token", async () => {
    const res = await request(app).post("/api/sweets").send(sweetData);
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/unauthorized/i);
  });
});