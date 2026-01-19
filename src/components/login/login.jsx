"use client";

import { useState } from "react";
import {
	Box,
	Input,
	Button,
	Heading,
	Text,
	VStack,
	useToast,
	InputGroup,
	InputLeftElement,
	Icon,
	Container,
	FormControl,
	FormLabel,
	Flex,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import { FaDumbbell } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const toast = useToast();
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await fetch(`/api/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					identifier: name,
					password,
				}),
			});

			const data = await res.json();

			if (res.ok && data.jwt) {
				// Guardar token y username
				sessionStorage.setItem("token", data.jwt);
				sessionStorage.setItem("username", data.user?.username || name);

				toast({
					title: "¡Bienvenido!",
					description: "Acceso concedido",
					status: "success",
					duration: 3000,
					isClosable: true,
				});

				router.push("/home"); // redirigir al home
			} else {
				toast({
					title: "Error de autenticación",
					description:
						data.error?.message || "Credenciales incorrectas",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (err) {
			console.error(err);
			toast({
				title: "Error de conexión",
				description: "No se pudo conectar al servidor",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Flex
			minH="100vh"
			align="center"
			justify="center"
			bgGradient="linear(to-br, teal.400, blue.500, purple.600)"
			position="relative"
			_before={{
				content: '""',
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				bgImage:
					"radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
				pointerEvents: "none",
			}}
		>
			<Container maxW="md" position="relative" zIndex={1}>
				<Box
					bg="white"
					p={8}
					borderRadius="2xl"
					boxShadow="2xl"
					backdropFilter="blur(10px)"
					transform="translateY(0)"
					transition="all 0.3s"
					_hover={{
						transform: "translateY(-5px)",
						boxShadow: "dark-lg",
					}}
				>
					{/* Logo/Icon */}
					<Flex justify="center" mb={6}>
						<Box
							bgGradient="linear(to-br, teal.400, teal.600)"
							p={6}
							borderRadius="full"
							boxShadow="xl"
							display="flex"
							alignItems="center"
							justifyContent="center"
						>
							<Icon as={FaDumbbell} boxSize={16} color="white" />
						</Box>
					</Flex>

					<Heading
						mb={2}
						textAlign="center"
						size="xl"
						bgGradient="linear(to-r, teal.500, blue.500)"
						bgClip="text"
						fontWeight="extrabold"
					>
						Sistema de Gimnasio
					</Heading>

					<Text
						textAlign="center"
						color="gray.600"
						mb={8}
						fontSize="sm"
					>
						Acceso Administrativo
					</Text>

					<form onSubmit={handleSubmit}>
						<VStack spacing={5}>
							<FormControl isRequired>
								<FormLabel
									color="gray.700"
									fontWeight="semibold"
								>
									Usuario
								</FormLabel>
								<InputGroup size="lg">
									<InputLeftElement height="full">
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="gray"
											strokeWidth="2"
										>
											<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
											<circle cx="12" cy="7" r="4" />
										</svg>
									</InputLeftElement>
									<Input
										placeholder="Ingresa tu usuario"
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
										required
										focusBorderColor="teal.500"
										bg="gray.50"
										_hover={{ bg: "gray.100" }}
										borderRadius="lg"
									/>
								</InputGroup>
							</FormControl>

							<FormControl isRequired>
								<FormLabel
									color="gray.700"
									fontWeight="semibold"
								>
									Contraseña
								</FormLabel>
								<InputGroup size="lg">
									<InputLeftElement height="full">
										<LockIcon color="gray.500" />
									</InputLeftElement>
									<Input
										type="password"
										placeholder="Ingresa tu contraseña"
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										required
										focusBorderColor="teal.500"
										bg="gray.50"
										_hover={{ bg: "gray.100" }}
										borderRadius="lg"
									/>
								</InputGroup>
							</FormControl>

							<Button
								type="submit"
								size="lg"
								width="full"
								bgGradient="linear(to-r, teal.400, blue.500)"
								color="white"
								_hover={{
									bgGradient:
										"linear(to-r, teal.500, blue.600)",
									transform: "translateY(-2px)",
									boxShadow: "lg",
								}}
								_active={{
									transform: "translateY(0)",
								}}
								isLoading={loading}
								loadingText="Verificando..."
								borderRadius="lg"
								fontWeight="bold"
								boxShadow="md"
								transition="all 0.2s"
							>
								Iniciar Sesión
							</Button>
						</VStack>
					</form>

					<Text
						mt={6}
						textAlign="center"
						fontSize="xs"
						color="gray.500"
					>
						© 2026 Sistema de Gestión
					</Text>
				</Box>
			</Container>
		</Flex>
	);
}
