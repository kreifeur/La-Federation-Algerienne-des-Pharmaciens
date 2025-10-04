"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  increment,
  decrement,
  reset,
  incrementByAmount,
  decrementByAmount,
} from "../../lib/store/features/counterSlice";
import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(1);

  return (
    <main className="flex flex-col items-center gap-6 p-10">
      <h1 className="text-2xl font-bold">Count: {count}</h1>

      <div className="flex gap-2">
        <button
          onClick={() => dispatch(increment())}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          +1
        </button>
        <button
          onClick={() => dispatch(decrement())}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          -1
        </button>
        <button
          onClick={() => dispatch(reset())}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Reset
        </button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        />
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(incrementByAmount(amount))}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            + Amount
          </button>
          <button
            onClick={() => dispatch(decrementByAmount(amount))}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            - Amount
          </button>
          <Link
            href="testredux"
            className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded shadow"
          >
            Go to Second Page →
          </Link>
        </div>
      </div>
    </main>
  );
}
