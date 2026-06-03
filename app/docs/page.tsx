"use client";

import { useState } from "react";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ContentGrid from "@/components/ContentGrid";
import { supabase } from "@/lib/supabase";

interface Post {
	slug: string;
	title: string;
	category: string;
	sub_category?: string;
	content: string;
	created_at: string;
}

export default function DocsPage() {
	const [items, setItems] = useState<Post[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
	const [selectedArticleSlug, setSelectedArticleSlug] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchPosts = async () => {
			const { data: posts, error } = await supabase
				.from("posts")
				.select("slug, title, category, sub_category, content, created_at")
				.order("created_at", { ascending: false });

			if (error) {
				console.error("Error fetching posts:", error);
			}

			setItems(posts || []);
			setIsLoading(false);
		};

		fetchPosts();
	}, []);

	if (isLoading) {
		return (
			<div className="flex h-screen bg-black items-center justify-center">
				<div className="text-gray-400 font-mono text-sm">Loading documentation...</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-black">
			<Sidebar
				items={items.map((p) => ({
					slug: p.slug,
					title: p.title,
					category: p.category,
					sub_category: p.sub_category,
				}))}
				basePath="/docs"
				type="docs"
				onCategorySelect={setSelectedCategory}
				onSubCategorySelect={setSelectedSubCategory}
				onArticleSelect={setSelectedArticleSlug}
				selectedCategory={selectedCategory}
				selectedSubCategory={selectedSubCategory}
			/>
			<ContentGrid
				items={items}
				basePath="/docs"
				type="docs"
				selectedCategory={selectedCategory}
				selectedSubCategory={selectedSubCategory}
				selectedArticleSlug={selectedArticleSlug}
			/>
		</div>
	);
}
