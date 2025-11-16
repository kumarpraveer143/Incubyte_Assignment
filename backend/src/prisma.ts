import {PrismaClient} from "@prisma/client"

// single DB connection that can be used by anyone just by importing it
const prisma=new PrismaClient();



export default prisma;