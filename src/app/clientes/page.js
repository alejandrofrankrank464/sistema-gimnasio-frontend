"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClientList from "@/components/clientes/clientlist";

export default function ClientesPage() {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		if (!token) {
			router.replace("/");
		} else {
			setIsAuthenticated(true);
		}
		setIsLoading(false);
	}, [router]);

	if (isLoading || !isAuthenticated) return null;

	return <ClientList />;
}
