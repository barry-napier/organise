import {
  PrismaClient,
  List as ListType,
  Task as TaskType,
} from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

type ListWithTasks = ListType & {
  tasks: TaskType[];
};

export default async function Page({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  try {
    const lists = await prisma.list.findMany({
      include: { tasks: true },
    });

    const params = await searchParams;
    const listId = typeof params.list === "string" ? params.list : undefined;

    const selectedList = lists.find((list) => list.id === listId) ?? lists[0];

    return (
      <div className="flex min-h-screen flex-col bg-neutral-950 px-8 pt-12 text-neutral-200">
        <List list={selectedList} />
        <Pagination lists={lists} selectedList={selectedList} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching lists:", error);
    return <div>Error loading page</div>;
  }
}

function List({ list }: ListProps) {
  const selectedTaskIndex = 0;

  return (
    <div className="text-neutral-500">
      <Header title={list.title} />
      <TaskCount count={list.tasks.length} />
      <TaskList tasks={list.tasks} selectedTaskIndex={selectedTaskIndex} />
    </div>
  );
}

type ListProps = Readonly<{ list: ListWithTasks }>;

function Header({ title }: HeaderProps) {
  return (
    <div className="bg-emerald-500 text-neutral-50 px-4 py-1">{title}</div>
  );
}

type HeaderProps = Readonly<{ title: string }>;

function TaskCount({ count }: TaskCountProps) {
  return (
    <div className="text-neutral-500 pt-5">
      <span>
        {count} {count === 1 ? "item" : "items"}
      </span>
    </div>
  );
}

type TaskCountProps = Readonly<{ count: number }>;

function TaskList({ tasks, selectedTaskIndex }: TaskListProps) {
  return (
    <div className="py-10">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          isSelected={index === selectedTaskIndex}
        />
      ))}
    </div>
  );
}

type TaskListProps = Readonly<{
  tasks: TaskType[];
  selectedTaskIndex: number;
}>;

function TaskItem({ task, isSelected }: TaskItemProps) {
  return (
    <div className="flex gap-6 mb-4">
      <div className={isSelected ? "border-l border-pink-500" : ""}></div>
      <div className={isSelected ? "text-pink-500" : ""}>
        <div className={isSelected ? "text-pink-500" : "text-white"}>
          {task.title}
        </div>
        <div>{task.description}</div>
      </div>
    </div>
  );
}

type TaskItemProps = Readonly<{ task: TaskType; isSelected: boolean }>;

function Pagination({ lists, selectedList }: PaginationProps) {
  return (
    <div className="flex items-center gap-1 pl-6">
      {lists.map((list) => (
        <PaginationDot
          key={list.id}
          list={list}
          isSelected={selectedList.id === list.id}
        />
      ))}
    </div>
  );
}

type PaginationProps = Readonly<{
  lists: ListWithTasks[];
  selectedList: ListWithTasks;
}>;

function PaginationDot({ list, isSelected }: PaginationDotProps) {
  return (
    <Link href={`/?list=${list.id}`}>
      <div
        className={`h-1.5 w-1.5 rounded-full ${
          isSelected ? "bg-neutral-300" : "bg-neutral-500"
        }`}
      ></div>
    </Link>
  );
}

type PaginationDotProps = Readonly<{
  list: ListWithTasks;
  isSelected: boolean;
}>;
