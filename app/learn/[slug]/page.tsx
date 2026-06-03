import { supabase, LearnResource } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Link from "next/link";
import { ChevronLeft, GraduationCap } from "lucide-react";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
	const { data: resources } = await supabase.from("learn").select("slug");
	return resources?.map((r) => ({ slug: r.slug })) || [];
}

export default async function LearnResourcePage({
	params,
}: {
	params: { slug: string };
}) {
	const { data: resource, error } = await supabase
		.from("learn")
		.select("*")
		.eq("slug", params.slug)
		.maybeSingle<LearnResource>();

	if (error || !resource) {
		notFound();
	}

	const { data: allResources } = await supabase
		.from("learn")
		.select("slug, title, category, sub_category");

	return (
		<div className="flex h-screen bg-black">
			<Sidebar
				items={allResources?.map((r) => ({
					slug: r.slug,
					title: r.title,
					category: r.category,
					sub_category: r.sub_category,
				})) || []}
				basePath="/learn"
				type="learn"
			/>
			<div className="flex-1 flex flex-col overflow-hidden">
				<header className="p-6 border-b border-gray-800 bg-[hsl(222,18%,8%)]">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<GraduationCap className="w-8 h-8 text-emerald-500" />
							<div>
								<h1 className="text-xl font-bold text-white tracking-wider font-mono">
									{resource.title}
								</h1>
								<div className="flex items-center gap-2 mt-1">
									<span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-600 text-xs font-mono rounded border border-yellow-500/30">
										{resource.category}
									</span>
									{resource.sub_category && (
										<span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-xs font-mono rounded border border-cyan-500/30">
											{resource.sub_category}
										</span>
									)}
								</div>
							</div>
						</div>
						<Link
							href="/learn"
							className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
						>
							<ChevronLeft className="w-4 h-4" />
							Back to Learning
						</Link>
					</div>
				</header>
				<div className="flex-1 overflow-y-auto p-8 bg-black">
					<article className="max-w-4xl mx-auto">
						<MarkdownRenderer content={resource.content} />
					</article>
				</div>
			</div>
		</div>
	);
}
