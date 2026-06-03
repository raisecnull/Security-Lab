"use client";

import { useState, useEffect } from "react";
import { Shield, AlertTriangle, Lock } from "lucide-react";

interface GatekeeperProps {
	children: React.ReactNode;
}

export default function Gatekeeper({ children }: GatekeeperProps) {
	const [agreed, setAgreed] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const hasAgreed = sessionStorage.getItem("secdoc_agreed_to_terms");
		if (hasAgreed === "true") {
			setAgreed(true);
		}
	}, []);

	const handleAgree = () => {
		if (agreed) {
			sessionStorage.setItem("secdoc_agreed_to_terms", "true");
			setAgreed(true);
		}
	};

	if (!mounted) {
		return null;
	}

	return (
		<>
			<div
				className={
					agreed
						? "opacity-100"
						: "opacity-0 pointer-events-none hidden max-h-screen overflow-hidden"
				}
			>
				{children}
			</div>

			{!agreed && (
				<div className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
					<div className="max-w-3xl w-full border-2 border-red-500/50 bg-[hsl(222,18%,8%)] p-8 rounded-lg">
						<div className="flex items-center justify-center mb-6">
							<div className="relative">
								<Shield className="w-16 h-16 text-red-500 animate-pulse" />
								<Lock className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2" />
							</div>
						</div>

						<h1 className="text-3xl font-bold text-center text-red-500 mb-2 tracking-wider">
							SECURITY WARNING
						</h1>
						<p className="text-center text-hsl(210,25%,95%) mb-8 text-sm">
							YOU MUST READ AND AGREE TO PROCEED
						</p>

						<div className="bg-[hsl(222,18%,12%)] border border-red-500/30 rounded p-6 mb-8">
							<p className="text-red-400 text-xs leading-relaxed tracking-wide font-mono uppercase">
								MUST READ! EVERYTHING IS PERFORMED IN A CONTROLLED/ISOLATED LAB.
								EVERY MALWARE, EXPLOIT, AND ATTACK PERFORMED IS STRICTLY FOR
								EDUCATIONAL PURPOSES. AUTHORIZED SYSTEMS ONLY. ALL MALWARES HAVE
								INTERNAL BOUNDARIES, SLEEP DELAYS, HARDCODED ACCIDENT KEYS, AND
								STRICT TIME-LIMITS BUILT IN. ANY MODIFICATION OR ALTERATION TO THE
								CODE MEANS IT IS ABSOLUTELY NOT MY CODE AND I HOLD ZERO
								RESPONSIBILITY.
							</p>
						</div>

						<div className="flex items-start gap-3 mb-8">
							<input
								type="checkbox"
								id="terms"
								checked={agreed}
								onChange={(e) => setAgreed(e.target.checked)}
								className="mt-1 w-5 h-5 rounded border-2 border-cyan-500 bg-transparent checked:bg-cyan-500 checked:border-cyan-500 cursor-pointer"
							/>
							<label
								htmlFor="terms"
								className="text-sm text-cyan-400 cursor-pointer leading-relaxed"
							>
								I ACCURATELY READ, UNDERSTAND, AND UNCONDITIONALLY AGREE TO COMPLY
								WITH THESE TERMS AND EDUCATIONAL BOUNDARIES.
							</label>
						</div>

						<button
							onClick={handleAgree}
							disabled={!agreed}
							className={`w-full py-3 rounded font-mono font-bold tracking-wider transition-all ${
								agreed
									? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-black hover:from-cyan-400 hover:to-emerald-400"
									: "bg-gray-700 text-gray-500 cursor-not-allowed"
							}`}
						>
							{agreed ? (
								<span className="flex items-center justify-center gap-2">
									<Lock className="w-5 h-5" />
									ACCESS ENVIRONMENT CONTENT
								</span>
							) : (
								<span className="flex items-center justify-center gap-2">
									<AlertTriangle className="w-5 h-5" />
									NOT YET AUTHORIZED
								</span>
							)}
						</button>
					</div>
				</div>
			)}
		</>
	);
}
