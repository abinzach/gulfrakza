"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <h1 className="text-9xl font-bold text-cyan-600">404</h1>
      <h2 className="mt-4 text-4xl font-semibold text-gray-800 dark:text-white">
        Page Not Found
      </h2>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
        Sorry, the page you are looking for does not exist.
      </p>
      <div className="mt-8 flex space-x-4">
        <Button
          onClick={() => router.back()}
          className="flex items-center bg-cyan-600 hover:bg-cyan-700"
        >
          &larr; Go Back
        </Button>
        <Link href="/">
          <Button className="flex items-center bg-cyan-600 hover:bg-cyan-700">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
