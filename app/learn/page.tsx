"use client";

import { useState } from "react";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ContentGrid from "@/components/ContentGrid";
import { supabase } from "@/lib/supabase";

interface LearnResource {
	slug: string;
	title: string;
	category: string;
	sub_category?: string;
	content: string;
	created_at: string;
}

export default function LearnPage() {
	const [items, setItems] = useState<LearnResource[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
	const [selectedArticleSlug, setSelectedArticleSlug] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchResources = async () => {
			const { data: resources, error } = await supabase
				.from("learn")
				.select("slug, title, category, sub_category, content, created_at")
				.order("created_at", { ascending: true });

			if (error) {
				console.error("Error fetching learn resources:", error);
			}

			setItems(resources || []);
			setIsLoading(false);
		};

		fetchResources();
	}, []);

	if (isLoading) {
		return (
			<div className="flex h-screen bg-black items-center justify-center">
				<div className="text-gray-400 font-mono text-sm">Loading resources...</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-black">
			<Sidebar
				items={items.map((r) => ({
					slug: r.slug,
					title: r.title,
					category: r.category,
					sub_category: r.sub_category,
				}))}
				basePath="/learn"
				type="learn"
				onCategorySelect={setSelectedCategory}
				onSubCategorySelect={setSelectedSubCategory}
				onArticleSelect={setSelectedArticleSlug}
				selectedCategory={selectedCategory}
				selectedSubCategory={selectedSubCategory}
			/>
			<ContentGrid
				items={items}
				basePath="/learn"
				type="learn"
				selectedCategory={selectedCategory}
				selectedSubCategory={selectedSubCategory}
				selectedArticleSlug={selectedArticleSlug}
			/>
		</div>
	);
}
