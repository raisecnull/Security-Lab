"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

interface SidebarItem {
	slug: string;
	title: string;
	category: string;
	sub_category?: string;
}

interface SidebarProps {
	items: SidebarItem[];
	onCategorySelect?: (category: string | null) => void;
	onSubCategorySelect?: (subCategory: string | null) => void;
	onArticleSelect?: (slug: string) => void;
	selectedCategory?: string | null;
	selectedSubCategory?: string | null;
	basePath: string;
	type: "docs" | "learn";
}

export default function Sidebar({
	items,
	onCategorySelect,
	onSubCategorySelect,
	onArticleSelect,
	selectedCategory,
	selectedSubCategory,
	basePath,
	type,
}: SidebarProps) {
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
		new Set()
	);
	const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(
		new Set()
	);
	const [searchQuery, setSearchQuery] = useState("");

	const toggleCategory = (category: string) => {
		setExpandedCategories((prev) => {
			const next = new Set(prev);
			if (next.has(category)) {
				next.delete(category);
			} else {
				next.add(category);
			}
			return next;
		});
	};

	const toggleSubCategory = (subCategory: string) => {
		setExpandedSubCategories((prev) => {
			const next = new Set(prev);
			if (next.has(subCategory)) {
				next.delete(subCategory);
			} else {
				next.add(subCategory);
			}
			return next;
		});
	};

	const groupedItems = items.reduce(
		(acc, item) => {
			if (!acc[item.category]) {
				acc[item.category] = {};
			}
			if (item.sub_category) {
				if (!acc[item.category][item.sub_category]) {
					acc[item.category][item.sub_category] = [];
				}
				acc[item.category][item.sub_category].push(item);
			} else {
				if (!acc[item.category]["__no_subcategory"]) {
					acc[item.category]["__no_subcategory"] = [];
				}
				acc[item.category]["__no_subcategory"].push(item);
			}
			return acc;
		},
		{} as Record<string, Record<string, SidebarItem[]>>
	);

	const sortedCategories = Object.keys(groupedItems).sort();

	const filteredCategories = sortedCategories.filter((category) => {
		const categoryMatches = category
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const hasMatchingSubItems = Object.entries(groupedItems[category]).some(
			([subCat, subItems]) => {
				return subItems.some(
					(item) =>
						item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
						subCat.toLowerCase().includes(searchQuery.toLowerCase())
				);
			}
		);
		return categoryMatches || hasMatchingSubItems;
	});

	return (
		<div className="w-72 min-h-screen bg-[hsl(222,18%,8%)] border-r border-gray-800 p-6 overflow-y-auto flex flex-col">
			<div className="mb-6">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search notes..."
						className="w-full pl-10 pr-3 py-2 bg-[hsl(222,18%,12%)] border border-gray-700 rounded text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
					/>
				</div>
			</div>

			<div className="mb-8">
				<h2 className="text-sm font-bold text-gray-400 tracking-widest font-mono uppercase mb-2">
					{type === "docs" ? "DOCS" : "LEARN"}
				</h2>
				<div className="h-px bg-gray-800" />
			</div>

			<nav className="flex-1 space-y-1">
				{filteredCategories.map((category) => {
					const isExpanded = expandedCategories.has(category);
					const categoryItems = groupedItems[category];
					const isSelected = selectedCategory === category;

					const sortedSubCategories = Object.keys(categoryItems)
						.filter((subCat) => subCat !== "__no_subcategory")
						.sort();

					return (
						<div key={category}>
							<button
								onClick={() => {
									toggleCategory(category);
									onCategorySelect?.(isSelected ? null : category);
								}}
								className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-900/50 rounded transition-colors group ${
									isSelected ? "bg-gray-900/80 text-gray-200" : ""
								}`}
							>
								{isExpanded ? (
									<ChevronDown className="w-4 h-4 text-gray-600" />
								) : (
									<ChevronRight className="w-4 h-4 text-gray-600" />
								)}
								<span className="font-mono text-xs tracking-wide uppercase">
									{category}
								</span>
							</button>

							{isExpanded && (
								<div className="ml-4 mt-1 space-y-0.5 border-l border-gray-800 pl-2">
									{sortedSubCategories.map((subCat) => {
										const isSubSelected = selectedSubCategory === subCat;
										const isSubExpanded = expandedSubCategories.has(subCat);
										const subItems = categoryItems[subCat];

										return (
											<div key={subCat}>
												<button
													onClick={() => {
														toggleSubCategory(subCat);
														onSubCategorySelect?.(isSubSelected ? null : subCat);
													}}
													className={`w-full flex items-center gap-3 px-3 py-1.5 text-xs font-mono text-gray-500 hover:text-gray-300 hover:bg-gray-900/50 rounded transition-colors ${
														isSubSelected
															? "bg-gray-900/60 text-gray-300"
															: ""
													}`}
												>
													{isSubExpanded ? (
														<ChevronDown className="w-3 h-3" />
													) : (
														<ChevronRight className="w-3 h-3" />
													)}
													<span className="truncate uppercase tracking-wide">
														{subCat}
													</span>
												</button>

												{isSubExpanded && (
													<div className="ml-4 mt-0.5 space-y-0.5">
														{subItems.map((item) => (
															<button
																key={item.slug}
																onClick={() => onArticleSelect?.(item.slug)}
																className="w-full text-left px-3 py-1.5 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-900/50 rounded transition-colors block"
															>
																{item.title}
															</button>
														))}
													</div>
												)}
											</div>
										);
									})}

									{categoryItems["__no_subcategory"]?.map((item) => (
										<button
											key={item.slug}
											onClick={() => onArticleSelect?.(item.slug)}
											className="w-full text-left px-3 py-1.5 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-900/50 rounded transition-colors block"
										>
											{item.title}
										</button>
									))}
								</div>
							)}
						</div>
					);
				})}
			</nav>
		</div>
	);
}
