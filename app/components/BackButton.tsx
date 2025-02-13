// app/components/BackButton.tsx
"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mb-4 px-4 py-2 text-sm hover:bg-gray-100 text-gray-600 rounded-full focus:outline-none"
    >
      &larr; Back
    </button>
  );
}
