"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface MarkdownRendererProps {
	content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
	const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

	const handleCopy = async (code: string, index: number) => {
		await navigator.clipboard.writeText(code);
		setCopiedIndex(index);
		setTimeout(() => setCopiedIndex(null), 2000);
	};

	return (
		<div className="border-l-2 border-yellow-500 pl-6">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeHighlight]}
				components={{
					h1: ({ children }) => (
						<h1 className="text-3xl font-bold text-[hsl(210,25%,95%)] tracking-tight mb-6 mt-8 first:mt-0">
							{children}
						</h1>
					),
					h2: ({ children }) => (
						<h2 className="text-2xl font-bold text-[hsl(210,25%,95%)] tracking-tight mb-4 mt-6">
							{children}
						</h2>
					),
					h3: ({ children }) => (
						<h3 className="text-lg font-bold text-cyan-400 mb-3 mt-5">
							{children}
						</h3>
					),
					h4: ({ children }) => (
						<h4 className="text-base font-bold text-emerald-400 mb-2 mt-4">
							{children}
						</h4>
					),
					p: ({ children }) => (
						<p className="text-[hsl(215,12%,75%)] leading-relaxed mb-4">
							{children}
						</p>
					),
					ul: ({ children }) => (
						<ul className="list-none space-y-2 mb-4 ml-4">{children}</ul>
					),
					ol: ({ children }) => (
						<ol className="list-decimal space-y-2 mb-4 ml-6">{children}</ol>
					),
					li: ({ children }) => (
						<li className="text-[hsl(215,12%,75%)] leading-relaxed flex items-start gap-2">
							<span className="text-cyan-500 mt-1.5 flex-shrink-0">•</span>
							<span>{children}</span>
						</li>
					),
					blockquote: ({ children }) => (
						<blockquote className="border-l-4 border-yellow-500/50 pl-4 py-2 my-4 bg-yellow-500/5 italic">
							{children}
						</blockquote>
					),
					a: ({ href, children }) => (
						<a
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
						>
							{children}
						</a>
					),
					strong: ({ children }) => (
						<strong className="font-bold text-[hsl(210,25%,95%)]">
							{children}
						</strong>
					),
					em: ({ children }) => (
						<em className="italic text-cyan-300">{children}</em>
					),
					hr: () => (
						<hr className="my-6 border-t border-cyan-500/20 opacity-50" />
					),
					table: ({ children }) => (
						<div className="overflow-x-auto my-4">
							<table className="min-w-full border border-cyan-500/30 rounded-lg overflow-hidden">
								{children}
							</table>
						</div>
					),
					thead: ({ children }) => (
						<thead className="bg-cyan-500/10 text-cyan-400">{children}</thead>
					),
					tbody: ({ children }) => (
						<tbody className="divide-y divide-cyan-500/20">{children}</tbody>
					),
					tr: ({ children }) => (
						<tr className="hover:bg-cyan-500/5 transition-colors">{children}</tr>
					),
					th: ({ children }) => (
						<th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider">
							{children}
						</th>
					),
					td: ({ children }) => (
						<td className="px-4 py-3 text-sm text-[hsl(215,12%,75%)]">
							{children}
						</td>
					),
					code: ({ className, children, ...props }) => {
						const match = /language-(\w+)/.exec(className || "");
						const isInline = !match;

						if (isInline) {
							return (
								<code
									className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 font-mono text-sm rounded border border-cyan-500/20"
									{...props}
								>
									{children}
								</code>
							);
						}

						return (
							<code className={className} {...props}>
								{children}
							</code>
						);
					},
					pre: ({ children, ...props }) => {
						const index = parseInt(
							(props as { "data-index"?: string })["data-index"] || "0"
						);

						const extractCode = (): string => {
							if (
								children &&
								typeof children === "object" &&
								"type" in (children as React.ReactElement) &&
								(children as React.ReactElement).props?.children
							) {
								const codeElement = children as React.ReactElement;
								return String(codeElement.props.children || "");
							}
							return "";
						};

						return (
							<div className="relative group my-4">
								<pre className="bg-[hsl(222,18%,6%)] border border-cyan-500/20 rounded-lg p-4 overflow-x-auto">
									<div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-2">
										<button
											onClick={() => handleCopy(extractCode(), index)}
											className="p-1.5 bg-cyan-500/20 rounded border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
											title="Copy code"
										>
											{copiedIndex === index ? (
												<Check className="w-4 h-4 text-emerald-400" />
											) : (
												<Copy className="w-4 h-4 text-cyan-400" />
											)}
										</button>
									</div>
									{children}
								</pre>
							</div>
						);
					},
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
