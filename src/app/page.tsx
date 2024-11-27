import { ListManager } from "@/components/list-manager";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Page({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const lists = await prisma.list.findMany({
    include: { tasks: true },
  });

  const params = await searchParams;
  const listId = typeof params.list === "string" ? params.list : undefined;

  const selectedListIndex = lists.findIndex((list) => list.id === listId) ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 px-8 pt-12 text-neutral-200">
      <ListManager lists={lists} initialListIndex={selectedListIndex} />
    </div>
  );
}
