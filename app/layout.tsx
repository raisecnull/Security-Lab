import "./globals.css";
import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";

const jetbrains = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "SecDoc - Cybersecurity Documentation Hub",
	description:
		"A comprehensive cybersecurity documentation and learning platform for security professionals",
	openGraph: {
		images: [
			{
				url: "https://bolt.new/static/og_default.png",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		images: [
			{
				url: "https://bolt.new/static/og_default.png",
			},
		],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${jetbrains.variable} ${inter.variable} dark`}
		>
			<body className="font-sans bg-[hsl(222,18%,6%)] text-[hsl(210,25%,95%)] antialiased">
				{children}
			</body>
		</html>
	);
}
