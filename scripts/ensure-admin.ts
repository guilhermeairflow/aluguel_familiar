import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@aluguelfamiliar.com";
  const password = "AluguelFamilia26!";
  const passwordHash = await hash(password, 12);

  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (existing) {
    console.log("Usuário Admin já existe. Atualizando senha para '2'...");
    await prisma.user.update({
      where: { email },
      data: { passwordHash }
    });
  } else {
    console.log("Criando usuário Admin padrão...");
    await prisma.user.create({
      data: {
        name: "Admin",
        email,
        passwordHash,
        role: "ADMIN" as any
      }
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });