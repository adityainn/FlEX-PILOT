const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  console.log("Connecting...");
  try {
    const user = await prisma.user.findFirst();
    console.log("Connected!", user);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
