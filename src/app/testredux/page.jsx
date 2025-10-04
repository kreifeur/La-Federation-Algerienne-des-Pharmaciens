"use client";

import Link from "next/link";
import { useSelector } from "react-redux";

export default function SecondPage() {
  const count = useSelector((state) => state.counter.value);

  return (
    <main className="flex flex-col items-center gap-6 p-10">
      <h1 className="text-2xl font-bold">This is the second page</h1>
      <p className="text-xl">Counter value: {count}</p>
      <Link
            href="test"
            className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded shadow"
          >
            Go to first Page →
          </Link>
    </main>
  );
}
