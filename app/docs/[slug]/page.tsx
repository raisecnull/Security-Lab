import { supabase, Post } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";
import { notFound } from "next/navigation";

// Force the page to render dynamically at runtime instead of crashing during building
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
    // If environment variables aren't initialized during the split-second build phase, 
    // return an empty array gracefully to prevent breaking the compilation.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
    
    const { data: posts } = await supabase.from("posts").select("slug");
    return posts?.map((post) => ({ slug: post.slug })) || [];
}

export default async function DocPage({
    params,
}: {
    params: { slug: string };
}) {
    const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", params.slug)
        .maybeSingle<Post>();

    if (error || !post) {
        notFound();
    }

    const { data: allPosts } = await supabase
        .from("posts")
        .select("slug, title, category, sub_category");

    return (
        <div className="flex h-screen bg-black">
            <Sidebar
                items={allPosts?.map((p) => ({
                    slug: p.slug,
                    title: p.title,
                    category: p.category,
                    sub_category: p.sub_category,
                })) || []}
                basePath="/docs"
                type="docs"
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="p-6 border-b border-gray-800 bg-[hsl(222,18%,8%)]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-yellow-500" />
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-wider font-mono">
                                    {post.title}
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-600 text-xs font-mono rounded border border-yellow-500/30">
                                        {post.category}
                                    </span>
                                    {post.sub_category && (
                                        <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-xs font-mono rounded border border-cyan-500/30">
                                            {post.sub_category}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Link
                            href="/docs"
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back to Docs
                        </Link>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8 bg-black">
                    <article className="max-w-4xl mx-auto">
                        <MarkdownRenderer content={post.content} />
                    </article>
                </div>
            </div>
        </div>
    );
}
