"use client";

import { useEffect, useState } from "react";
import { Box, Container, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/Header";
import NavigationCards from "@/components/dashboard/NavigationCards";
import RecentActivity from "@/components/dashboard/RecentActivity";
import Footer from "@/components/dashboard/Footer";

export default function HomePage() {
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

	return (
		<Box minH="100vh" bg="gray.50" display="flex" flexDirection="column">
			<Container maxW="1200px" py={6} flex="1">
				<VStack spacing={8} align="stretch">
					<Header />
					<NavigationCards />
					<RecentActivity />
				</VStack>
			</Container>
			<Footer />
		</Box>
	);
}
