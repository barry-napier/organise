// seed.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const lists = [
  {
    id: "b8a7b7c4-9d4d-4b33-9a8e-1c8e5b87c9b1",
    title: "Work",
    tasks: [
      {
        id: "f3c9d2a2-48d3-4a1f-bc1a-7d2a3f9c9d2f",
        title: "Finish report",
        description: "Complete the quarterly financial report",
        complete: true,
      },
      {
        id: "c4d2a7b8-4e3f-4b1c-8d2a-3c9d2f7a8b1c",
        title: "Email client",
        description: "Send the proposal to the new client",
        complete: false,
      },
      {
        id: "d2a7b8c4-3f4e-1c8d-b2a7-9f8c2d3a1b4c",
        title: "Team meeting",
        description: "Discuss project milestones",
        complete: false,
      },
    ],
  },
  {
    id: "a2b3c4d5-6e7f-8a9b-0c1d-2e3f4a5b6c7d",
    title: "Personal",
    tasks: [
      {
        id: "b4c3d2a1-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
        title: "Grocery shopping",
        description: "Buy vegetables and fruits",
        complete: true,
      },
      {
        id: "c5b4a3d2-6f7e-8b9a-0d1c-2f3e4a5b6c7d",
        title: "Gym",
        description: "Attend yoga class",
        complete: false,
      },
      {
        id: "d6c5b4a3-7e8f-9a0b-1c2d-3f4e5a6b7c8d",
        title: "Read book",
        description: "Finish reading 'Atomic Habits'",
        complete: true,
      },
    ],
  },
  {
    id: "e3f4a5b6-7c8d-9a0b-1c2d-3e4f5a6b7c8d",
    title: "Home Improvement",
    tasks: [
      {
        id: "f5e4d3c2-8b9a-0c1d-2e3f-4a5b6c7d8e9f",
        title: "Paint living room",
        description: "Choose a color and paint the walls",
        complete: false,
      },
      {
        id: "a6f5e4d3-9b0a-1c2d-3e4f-5a6b7c8d9e0f",
        title: "Fix leaky faucet",
        description: "Replace the kitchen faucet washer",
        complete: true,
      },
      {
        id: "b7a6f5e4-0c1d-2e3f-4a5b-6c7d8e9f0a1b",
        title: "Organize garage",
        description: "Sort and organize tools and boxes",
        complete: false,
      },
    ],
  },
];

async function main() {
  for (const list of lists) {
    await prisma.list.create({
      data: {
        id: list.id,
        title: list.title,
        tasks: {
          create: list.tasks.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            complete: task.complete,
          })),
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
