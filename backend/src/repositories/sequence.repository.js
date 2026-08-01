import prisma from "../config/prisma.js";

export async function getNextSequence(key) {
  const sequence = await prisma.sequence.upsert({
    where: {
      key,
    },

    update: {
      value: {
        increment: 1,
      },
    },

    create: {
      key,
      value: 1,
    },
  });

  return sequence.value;
}