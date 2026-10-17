import Link from "next/link";

export const metadata = { title: "Offline - Pokémon Search App" };

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md bg-white p-6 rounded-2xl shadow-sm shadow-amber-200 text-center">
        <h1 className="text-xl font-semibold mb-2">You&apos;re offline</h1>
        <p className="text-gray-600 mb-4">
          This page isn&apos;t available without a connection. Pokémon you searched
          recently are still available once you&apos;re back on the home page.
        </p>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to home
        </Link>
      </div>
    </main>
  );
}
