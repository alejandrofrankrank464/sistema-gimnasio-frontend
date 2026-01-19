"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PagosView from "@/components/pagos/PagosView";

export default function PagosPage() {
	const router = useRouter();

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		if (!token) {
			router.replace("/");
		}
	}, [router]);

	return <PagosView />;
}
