"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
	const [imageLoaded, setImageLoaded] = useState(false);

	useEffect(() => {
		const img = new Image();
		img.src = "/image.png";
		img.onload = () => setImageLoaded(true);
	}, []);

	return (
		<div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
			<header className="z-50 border-b border-cyan-500/20 backdrop-blur-sm bg-black/80 py-4 px-6">
				<div className="max-w-7xl mx-auto flex items-center gap-3">
					<img src="/gopher.png" alt="SecDoc" className="w-8 h-8" />
					<span className="text-lg font-bold text-white font-mono tracking-wider">
						SECDoc
					</span>
				</div>
			</header>

			<main className="flex-1 flex items-center justify-center px-6 py-12">
				<div className="w-full max-w-6xl">
					<div className="text-center mb-8 md:mb-12">
						<h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
							Choose Your Path
						</h1>
						<p className="text-gray-400 text-sm md:text-base font-mono">
							Knowledge awaits. Which reality will you accept?
						</p>
					</div>

					<div className="relative flex items-center justify-center">
						<img
							src="/image.png"
							alt="Red pill or Blue pill"
							className="w-full max-w-2xl h-auto"
						/>

						{imageLoaded && (
							<>
								<Link
									href="/learn"
									className="absolute left-0 top-1/2 -translate-y-1/2 w-1/4 h-full cursor-pointer group opacity-0 hover:opacity-100 transition-all duration-300"
									style={{
										left: "5%",
										width: "35%",
									}}
								>
									<div className="absolute inset-0 flex flex-col items-center justify-center">
										<div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
										<span className="text-blue-400 font-bold text-lg md:text-2xl font-mono uppercase tracking-wider z-10">
											Learn
										</span>
									</div>
								</Link>

								<Link
									href="/docs"
									className="absolute right-0 top-1/2 -translate-y-1/2 w-1/4 h-full cursor-pointer group opacity-0 hover:opacity-100 transition-all duration-300"
									style={{
										right: "5%",
										width: "35%",
									}}
								>
									<div className="absolute inset-0 flex flex-col items-center justify-center">
										<div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
										<span className="text-red-400 font-bold text-lg md:text-2xl font-mono uppercase tracking-wider z-10">
											Offensive Security
										</span>
									</div>
								</Link>
							</>
						)}
					</div>

					<div className="text-center mt-8 md:mt-12">
						<p className="text-xs text-gray-600 font-mono uppercase tracking-wider">
							Remember: This is the way.
						</p>
					</div>
				</div>
			</main>

			<footer className="border-t border-gray-800 bg-black/80 py-4 px-6 text-center text-xs text-gray-600 font-mono">
				Educational Content • Terms Required • Authorized Use Only
			</footer>
		</div>
	);
}
