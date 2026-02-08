import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#f8f7f4]">
      <h1 className="text-2xl font-semibold text-[#4a4a4a] mb-2">
        Page not found
      </h1>
      <p className="text-[#8a8a8a] text-center mb-6 max-w-md">
        Don&apos;t worry. Sometimes we get lost. How about heading back to the start?
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-[#6b9080] text-white font-medium hover:opacity-90 transition-opacity"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
