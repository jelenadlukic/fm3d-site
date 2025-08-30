import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SmartImage } from "@/components/SmartImage"; // ili Image iz next/image uz rešenje A
import ReactMarkdown from "react-markdown";

export default async function PublicVest({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findFirst({
    where: { slug: params.slug, published: true },
  });
  if (!post) notFound();

  const src =
    post.coverUrl && post.coverUrl.startsWith("http")
      ? post.coverUrl
      : "/images/o-projektu/hero1.png";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-3">{post.title}</h1>

      <div className="relative h-72 w-full mb-4 overflow-hidden rounded-xl border border-border bg-black/10">
        <SmartImage
          src={src}
          alt={post.title}
          fill
          sizes="100vw"
          className="object-contain object-center"
        />
        {/* Ako koristiš rešenje A: zameni SmartImage sa <Image ... /> */}
      </div>

      {post.excerpt && <p className="opacity-80 mb-4">{post.excerpt}</p>}

      <article className="prose prose-invert max-w-none">
        <ReactMarkdown>{post.content ?? ""}</ReactMarkdown>
      </article>
    </main>
  );
}
