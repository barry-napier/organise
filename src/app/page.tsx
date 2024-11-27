import { prisma } from "@/lib/prisma";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export default async function Page() {
  const lists = await prisma.list.findMany();

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 px-8 pt-12 text-neutral-200">
      <Pagination lists={lists} />
    </div>
  );
}

function Pagination({ lists }) {
  return (
    <div>
      {lists.map((list) {
        return (
          <Link href={/?list=${list}}>
            <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
          </Link>
        )
      } )}
    </div>
  );
}

async function UsersTable({
  searchParams,
}: Readonly<{
  searchParams: { [key: string]: string | string[] | undefined };
}>) {
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const perPage = 7;
  const totalUsers = await prisma.list.count({
    where: {
      title: {
        contains: search,
      },
    },
  });
  const totalPages = Math.ceil(totalUsers / perPage);

  const page =
    typeof searchParams.page === "string" &&
    +searchParams.page > 1 &&
    +searchParams.page <= totalPages
      ? +searchParams.page
      : 1;

  const lists = await prisma.list.findMany({
    take: perPage,
    skip: (page - 1) * perPage,
    where: {
      title: {
        contains: search,
      },
    },
  });

  const currentSearchParams = new URLSearchParams();

  if (search) {
    currentSearchParams.set("search", search);
  }

  if (page > 1) {
    currentSearchParams.set("page", `${page}`);
  }

  return (
    <div>
      <div className="mt-8 flow-root">
        <div className="-mx-6 -my-2">
          <div className="inline-block min-w-full px-6 py-2 align-middle">
            <div className="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-[130px] px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:w-auto">
                      Name
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {lists.map((list) => (
                    <tr key={list.id}>
                      <td className="max-w-[130px] truncate whitespace-nowrap px-3 py-4 text-sm font-medium sm:w-auto">
                        {list.title}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-4 pr-4 text-right text-sm font-medium">
                        <Link
                          href="/#"
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                          <ChevronRightIcon className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-semibold">{(page - 1) * perPage + 1}</span> to{" "}
          <span className="font-semibold">
            {Math.min(page * perPage, totalUsers)}
          </span>{" "}
          of <span className="font-semibold">{totalUsers}</span> users
        </p>
        <div className="space-x-2">
          <PreviousPage page={page} currentSearchParams={currentSearchParams} />
          <NextPage
            page={page}
            totalPages={totalPages}
            currentSearchParams={currentSearchParams}
          />
        </div>
      </div>
    </div>
  );
}

function PreviousPage({
  page,
  currentSearchParams,
}: {
  page: number;
  currentSearchParams: URLSearchParams;
}) {
  const newSearchParams = new URLSearchParams(currentSearchParams);

  if (page > 2) {
    newSearchParams.set("page", `${page - 1}`);
  } else {
    newSearchParams.delete("page");
  }

  return page > 1 ? (
    <Link
      href={`/?${newSearchParams}`}
      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
    >
      Previous
    </Link>
  ) : (
    <button
      disabled
      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 opacity-50"
    >
      Previous
    </button>
  );
}

function NextPage({
  page,
  totalPages,
  currentSearchParams,
}: {
  page: number;
  totalPages: number;
  currentSearchParams: URLSearchParams;
}) {
  const newSearchParams = new URLSearchParams(currentSearchParams);

  newSearchParams.set("page", `${page + 1}`);

  return page < totalPages ? (
    <Link
      href={`/?${newSearchParams}`}
      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
    >
      Next
    </Link>
  ) : (
    <button
      disabled
      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 opacity-50"
    >
      Next
    </button>
  );
}
