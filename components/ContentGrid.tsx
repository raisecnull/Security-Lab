"use client";

import { useState } from "react";
import { Search, Calendar } from "lucide-react";
import Link from "next/link";

interface ContentItem {
	slug: string;
	title: string;
	category: string;
	sub_category?: string;
	content: string;
	created_at: string;
}

interface ContentGridProps {
	items: ContentItem[];
	basePath: string;
	type: "docs" | "learn";
	selectedCategory?: string | null;
	selectedSubCategory?: string | null;
	selectedArticleSlug?: string;
}

const formatDate = (dateString: string): string => {
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "2-digit",
			year: "numeric",
		});
	} catch {
		return "Unknown";
	}
};

const getContentPreview = (content: string): string => {
	const cleaned = content
		.replace(/[#*`\[\]()]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	return cleaned.length > 120 ? cleaned.slice(0, 120) + "..." : cleaned;
};

export default function ContentGrid({
	items,
	basePath,
	type,
	selectedCategory,
	selectedSubCategory,
	selectedArticleSlug,
}: ContentGridProps) {
	const [searchQuery, setSearchQuery] = useState("");

	let filteredItems = items;

	if (selectedCategory) {
		filteredItems = filteredItems.filter((item) => item.category === selectedCategory);
	}

	if (selectedSubCategory) {
		filteredItems = filteredItems.filter(
			(item) => item.sub_category === selectedSubCategory
		);
	}

	if (searchQuery.trim()) {
		const query = searchQuery.toLowerCase();
		filteredItems = filteredItems.filter(
			(item) =>
				item.title.toLowerCase().includes(query) ||
				(item.sub_category && item.sub_category.toLowerCase().includes(query)) ||
				item.content.toLowerCase().includes(query)
		);
	}

	const totalNotes = items.length;
	const totalCategories = new Set(items.map((i) => i.category)).size;
	const totalSubTopics = new Set(
		items.filter((i) => i.sub_category).map((i) => i.sub_category!)
	).size;

	return (
		<div className="flex-1 flex flex-col">
			<div className="p-8 border-b border-gray-800 bg-[hsl(222,18%,6%)]">
				<div className="max-w-7xl">
					<h1 className="text-4xl font-bold text-white mb-2">
						{type === "docs" ? "Documentation" : "Learning Resources"}
					</h1>
					<p className="text-gray-400 text-sm mb-6">
						"If you can't explain it to a six-year-old, you don't understand it
						yourself." -Albert Einstein.
					</p>

					<div className="grid grid-cols-3 gap-4 mb-8">
						<div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
							<div className="text-3xl font-bold text-blue-400 mb-1">
								{totalNotes}
							</div>
							<div className="text-xs font-mono text-gray-500 uppercase tracking-wider">
								Total Notes
							</div>
						</div>
						<div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
							<div className="text-3xl font-bold text-cyan-400 mb-1">
								{totalCategories}
							</div>
							<div className="text-xs font-mono text-gray-500 uppercase tracking-wider">
								Categories
							</div>
						</div>
						<div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
							<div className="text-3xl font-bold text-yellow-400 mb-1">
								{totalSubTopics}
							</div>
							<div className="text-xs font-mono text-gray-500 uppercase tracking-wider">
								Sub-Topics
							</div>
						</div>
					</div>

					<div className="relative">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search..."
							className="w-full pl-12 pr-4 py-2 bg-gray-900 border border-gray-800 rounded text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-gray-700 transition-colors"
						/>
					</div>
				</div>
			</div>

			<div className="flex-1 p-8 overflow-y-auto">
				<div className="max-w-7xl">
					{filteredItems.length === 0 ? (
						<div className="text-center py-12">
							<div className="w-16 h-16 text-gray-700 mx-auto mb-4">
								<Calendar className="w-full h-full" />
							</div>
							<p className="text-gray-500 font-mono text-sm">
								{searchQuery
									? `No results found for "${searchQuery}"`
									: "No articles available"}
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredItems.map((item) => (
								<Link
									key={item.slug}
									href={`${basePath}/${item.slug}`}
									className="group bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]"
								>
									<div className="mb-4">
										<span className="inline-block px-2 py-1 bg-yellow-500/10 text-yellow-600 text-xs font-mono rounded border border-yellow-500/30 uppercase tracking-wide">
											{item.sub_category || item.category}
										</span>
									</div>

									<h3 className="font-bold text-white text-sm group-hover:text-gray-300 transition-colors line-clamp-2 mb-3 leading-tight">
										{item.title}
									</h3>

									{item.content && (
										<p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-4">
											{getContentPreview(item.content)}
										</p>
									)}

									<div className="flex items-center gap-2 text-xs text-gray-600 font-mono">
										<Calendar className="w-3 h-3" />
										{formatDate(item.created_at)}
									</div>
								</Link>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
