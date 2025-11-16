import request from "supertest";
import app from "../src/app";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

describe("Category API", () => {
  let server: any;
  let authToken: string;
  let categoryId: number;

  const adminLogin:any = {
    email: "user1@example.com",
    password: "PassworD@1",
  };

  beforeAll(async () => {
    await prisma.purchase.deleteMany();
    await prisma.restockLog.deleteMany();
    await prisma.sweet.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    server = app.listen(3001);

    const password=await bcrypt.hash(adminLogin.password,10);
    await prisma.user.create({data:{name:"user1",password,email:adminLogin.email,role:"ADMIN"}});

    // log in user to get token
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send(adminLogin);

    authToken = loginRes.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await server.close();
  });

//  test1: Create Category
  it("should create a category successfully", async () => {
    const res = await request(app)
      .post("/api/category")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name: "Cakes" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("category");
    expect(res.body.category.name).toBe("Cakes");

    categoryId = res.body.category.id;
  });
// test2: Create Category without name
  it("should return 400 if name is missing", async () => {
    const res = await request(app)
      .post("/api/category")
      .set("Authorization", `Bearer ${authToken}`)
      .send({});

    expect(res.status).toBe(400);
  });
// test3: Delete Category
  it("should delete the created category", async () => {
    const res = await request(app)
      .delete(`/api/category/${categoryId}`)
      .set("Authorization", `Bearer ${authToken}`);
    console.log(categoryId);
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
// test4: Delete non-existent category
  it("should return 404 for non-existent category", async () => {
    const res = await request(app)
      .delete("/api/category/99999")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(404);
  });
});
