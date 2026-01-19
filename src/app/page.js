"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "@/components/login/login";

export default function Home() {
	const router = useRouter();

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		if (token) {
			router.push("/home");
		}
	}, [router]);

	return <LoginPage />;
}
