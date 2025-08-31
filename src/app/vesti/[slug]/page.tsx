import { prisma } from "@/lib/prisma";
import { signedUrl } from "@/lib/supabaseImage";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function PublicVest({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: { slug, published: true },
    select: {
      id: true, title: true, excerpt: true, content: true,
      coverUrl: true, coverPath: true, createdAt: true, slug: true,
    },
  });

  if (!post) return notFound();

  let coverSrc = "/images/o-projektu/hero1.png";
  if (post.coverPath) {
    try { coverSrc = await signedUrl(post.coverPath); } catch {}
  } else if (post.coverUrl?.startsWith("http")) {
    coverSrc = post.coverUrl;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <time className="text-xs opacity-70">{new Date(post.createdAt).toLocaleString()}</time>

      <div className="relative my-6 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/50 bg-black/5">
        <Image src={coverSrc} alt={post.title} fill sizes="100vw" className="object-contain" />
      </div>

      {post.excerpt && <p className="mb-4 opacity-80">{post.excerpt}</p>}

      {post.content && (
        <article className="prose prose-invert max-w-none">
          <div>{post.content}</div>
        </article>
      )}
    </main>
  );
}
