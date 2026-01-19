"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Ajustes from "@/components/ajustes/Ajustes";

export default function AjustesPage() {
	const router = useRouter();

	const hasToken = useMemo(() => {
		if (typeof window === "undefined") return false;
		return !!sessionStorage.getItem("token");
	}, []);

	useEffect(() => {
		if (!hasToken) {
			router.replace("/");
		}
	}, [router, hasToken]);

	if (!hasToken) return null;

	return <Ajustes />;
}
