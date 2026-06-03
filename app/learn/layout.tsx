import Gatekeeper from "@/components/Gatekeeper";

export default function LearnLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Gatekeeper>{children}</Gatekeeper>;
}
