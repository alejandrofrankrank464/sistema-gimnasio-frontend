"use client";

import {
	Box,
	Flex,
	Heading,
	Text,
	Button,
	Avatar,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuDivider,
	HStack,
	Image,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";

export default function Header() {
	const router = useRouter();

	// Lazy initialization - solo se ejecuta una vez en el mount inicial
	const [username] = useState(() =>
		typeof window !== "undefined"
			? sessionStorage.getItem("username") || "Usuario"
			: "Usuario"
	);
	const [userEmail] = useState(() =>
		typeof window !== "undefined"
			? sessionStorage.getItem("userEmail") || ""
			: ""
	);
	const [logoUrl, setLogoUrl] = useState(null);

	useEffect(() => {
		const fetchLogo = async () => {
			try {
				const token = sessionStorage.getItem("token");
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/configuraciones/logo`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);

				if (res.ok) {
					const data = await res.json();
					if (data.data && data.data.url) {
						setLogoUrl(
							`${process.env.NEXT_PUBLIC_API_URL}${data.data.url}`
						);
					}
				}
			} catch (error) {
				console.error("Error al cargar logo:", error);
			}
		};

		fetchLogo();
	}, []);

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("username");
		sessionStorage.removeItem("userEmail");
		router.push("/");
	};

	const getInitials = (name) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<Flex
			justify="space-between"
			align="center"
			mb={8}
			pb={4}
			borderBottomWidth="1px"
			borderColor="gray.200"
		>
			<Flex align="center" gap={4}>
				{logoUrl && (
					<Image
						src={logoUrl}
						alt="Logo del gimnasio"
						maxH="60px"
						objectFit="contain"
					/>
				)}
				<Box>
					<Heading size="lg" mb={1}>
						Gym{" "}
						<Text
							as="span"
							fontWeight="extrabold"
							color="teal.500"
							fontFamily="'Segoe UI', sans-serif"
						>
							Las Barquirias
						</Text>
					</Heading>
					<Text fontSize="sm" color="gray.600">
						Panel de Administración
					</Text>
				</Box>
			</Flex>

			<HStack spacing={3}>
				<Menu>
					<MenuButton
						as={Button}
						rightIcon={<ChevronDownIcon />}
						variant="ghost"
						_hover={{ bg: "gray.100" }}
					>
						<HStack spacing={3}>
							<Avatar
								size="sm"
								name={username}
								bg="teal.500"
								color="white"
							/>
							<Box
								textAlign="left"
								display={{ base: "none", md: "block" }}
							>
								<Text fontSize="sm" fontWeight="semibold">
									{username}
								</Text>
								{userEmail && (
									<Text fontSize="xs" color="gray.600">
										{userEmail}
									</Text>
								)}
							</Box>
						</HStack>
					</MenuButton>
					<MenuList>
						<MenuItem
							icon={<SettingsIcon />}
							onClick={() => router.push("/ajustes")}
						>
							Ajustes
						</MenuItem>
						<MenuDivider />
						<MenuItem color="red.500" onClick={handleLogout}>
							Cerrar sesión
						</MenuItem>
					</MenuList>
				</Menu>
			</HStack>
		</Flex>
	);
}
