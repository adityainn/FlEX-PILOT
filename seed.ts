import "dotenv/config";
import { prisma } from "./src/services/db";

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      id: "test-user-1",
      name: "Test User",
      email: "test@example.com",
    }
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: "Acme Corp",
      userId: user.id,
      projects: {
        create: {
          id: "https://github.com/acme/demo-react-store",
          name: "demo-react-store",
          repositoryUrl: "https://github.com/acme/demo-react-store",
          framework: "nextjs",
          packageManager: "npm",
          hasTypeScript: true
        }
      }
    }
  });
  console.log("Seeded:", workspace);
}
main();
