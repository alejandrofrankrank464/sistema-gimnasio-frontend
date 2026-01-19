"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Horario from "@/components/horario/Horario";

export default function HorarioPage() {
	const router = useRouter();

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		if (!token) {
			router.replace("/");
		}
	}, [router]);

	return <Horario />;
}
