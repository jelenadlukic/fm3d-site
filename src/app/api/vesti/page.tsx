import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // ISR: sveže na ~1 min

export default async function VestiPage() {
 //

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Vesti</h1>

        <div className="grid gap-6 md:grid-cols-2">
          //
        </div>
      </div>
    </main>
  );
}
