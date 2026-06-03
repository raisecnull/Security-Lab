import Gatekeeper from "@/components/Gatekeeper";

export default function DocsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Gatekeeper>{children}</Gatekeeper>;
}
