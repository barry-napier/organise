"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { List as ListType, Task as TaskType } from "@prisma/client";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ListWithTasks = ListType & {
  tasks: TaskType[];
};

export function ListManager({
  lists,
  initialListIndex,
}: Readonly<{
  lists: ListWithTasks[];
  initialListIndex: number;
}>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentListIndex = Math.max(
    0,
    Math.min(
      parseInt(searchParams.get("list") || initialListIndex.toString(), 10),
      lists.length - 1
    )
  );

  const currentTaskIndex = Math.max(
    0,
    Math.min(
      parseInt(searchParams.get("task") || "0", 10),
      lists[currentListIndex]?.tasks.length - 1 || 0
    )
  );

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      let newListIndex = currentListIndex;
      let newTaskIndex = currentTaskIndex;

      switch (event.key) {
        case "ArrowUp":
        case "k":
          newTaskIndex = Math.max(currentTaskIndex - 1, 0);
          break;
        case "ArrowDown":
        case "j":
          newTaskIndex = Math.min(
            currentTaskIndex + 1,
            lists[currentListIndex].tasks.length - 1
          );
          break;
        case "ArrowLeft":
        case "h":
        case "PageUp":
          newListIndex = Math.max(currentListIndex - 1, 0);
          newTaskIndex = 0;
          break;
        case "ArrowRight":
        case "l":
        case "PageDown":
          newListIndex = Math.min(currentListIndex + 1, lists.length - 1);
          newTaskIndex = 0;
          break;
        case "g":
        case "Home":
          newListIndex = 0;
          newTaskIndex = 0;
          break;
        case "G":
        case "End":
          newListIndex = lists.length - 1;
          newTaskIndex = 0;
          break;
        case "Enter":
          await markTaskAsComplete(
            lists[currentListIndex].tasks[currentTaskIndex].id
          );
          break;
        default:
          return;
      }

      router.push(`/?list=${newListIndex}&task=${newTaskIndex}`);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentListIndex, currentTaskIndex, lists, router]);

  const markTaskAsComplete = async (taskId: string) => {
    try {
      await prisma.task.update({
        where: { id: taskId },
        data: { complete: true },
      });
      // Optionally, refresh the data or update the UI to reflect changes
    } catch (error) {
      console.error("Failed to mark task as complete:", error);
    }
  };

  const selectedList = lists[currentListIndex];

  return (
    <>
      <List list={selectedList} selectedTaskIndex={currentTaskIndex} />
      <Pagination lists={lists} selectedList={selectedList} />
    </>
  );
}

function List({
  list,
  selectedTaskIndex,
}: Readonly<{ list: ListWithTasks; selectedTaskIndex: number }>) {
  return (
    <div className="text-neutral-500">
      <Header title={list.title} />
      <TaskCount count={list.tasks.length} />
      <TaskList tasks={list.tasks} selectedTaskIndex={selectedTaskIndex} />
    </div>
  );
}

function Header({ title }: Readonly<{ title: string }>) {
  return (
    <div className="bg-emerald-500 text-neutral-50 px-4 py-1">{title}</div>
  );
}

function TaskCount({ count }: Readonly<{ count: number }>) {
  return (
    <div className="text-neutral-500 pt-5">
      <span>
        {count} {count === 1 ? "item" : "items"}
      </span>
    </div>
  );
}

function TaskList({
  tasks,
  selectedTaskIndex,
}: Readonly<{ tasks: TaskType[]; selectedTaskIndex: number }>) {
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

function TaskItem({
  task,
  isSelected,
}: Readonly<{ task: TaskType; isSelected: boolean }>) {
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

function Pagination({
  lists,
  selectedList,
}: Readonly<{ lists: ListWithTasks[]; selectedList: ListWithTasks }>) {
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

function PaginationDot({
  list,
  isSelected,
}: Readonly<{ list: ListWithTasks; isSelected: boolean }>) {
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

export default ListManager;
