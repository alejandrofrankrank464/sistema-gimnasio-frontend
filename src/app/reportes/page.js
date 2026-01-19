"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Reportes from "@/components/reportes/Reportes";

export default function ReportesPage() {
	const router = useRouter();

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		if (!token) {
			router.replace("/");
		}
	}, [router]);

	return <Reportes />;
}
