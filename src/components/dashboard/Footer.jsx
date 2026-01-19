"use client";

import {
	Box,
	Container,
	Flex,
	Text,
	Stack,
	Link,
	Divider,
	Icon,
	HStack,
} from "@chakra-ui/react";
import { FaHeart, FaDumbbell } from "react-icons/fa";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<Box
			as="footer"
			bg="white"
			borderTopWidth="1px"
			borderColor="gray.200"
			mt="auto"
		>
			<Container maxW="1200px" py={8}>
				<Stack spacing={6}>
					<Flex
						direction={{ base: "column", md: "row" }}
						justify="space-between"
						align={{ base: "center", md: "flex-start" }}
						gap={6}
					>
						{/* Sección izquierda */}
						<Stack
							spacing={2}
							align={{ base: "center", md: "flex-start" }}
						>
							<Flex align="center" gap={2}>
								<Icon
									as={FaDumbbell}
									color="teal.500"
									boxSize={5}
								/>
								<Text
									fontWeight="bold"
									fontSize="lg"
									color="gray.700"
								>
									Gym Las Barquirias
								</Text>
							</Flex>
							<Text fontSize="sm" color="gray.600">
								Panel de Administración
							</Text>
						</Stack>

						{/* Sección central - Links */}
						<Stack
							direction={{ base: "column", sm: "row" }}
							spacing={{ base: 2, sm: 6 }}
							align="center"
						>
							<Link
								href="/clientes"
								fontSize="sm"
								color="gray.600"
								_hover={{
									color: "teal.500",
									textDecoration: "none",
								}}
							>
								Clientes
							</Link>
							<Link
								href="/pagos"
								fontSize="sm"
								color="gray.600"
								_hover={{
									color: "teal.500",
									textDecoration: "none",
								}}
							>
								Pagos
							</Link>
							<Link
								href="/ajustes"
								fontSize="sm"
								color="gray.600"
								_hover={{
									color: "teal.500",
									textDecoration: "none",
								}}
							>
								Ajustes
							</Link>
						</Stack>

						{/* Sección derecha */}
						<Stack
							spacing={1}
							align={{ base: "center", md: "flex-end" }}
						>
							<Text fontSize="sm" color="gray.600">
								Sistema de gestión
							</Text>
							<Text fontSize="xs" color="gray.500">
								v1.0.0
							</Text>
						</Stack>
					</Flex>

					<Divider />

					{/* Copyright */}
					<Flex
						direction={{ base: "column", sm: "row" }}
						justify="space-between"
						align="center"
						gap={2}
					>
						<Text fontSize="xs" color="gray.500">
							© {currentYear} Gym Las Barquirias. Todos los
							derechos reservados.
						</Text>
						<HStack spacing={1} fontSize="xs" color="gray.500">
							<Text>Hecho con</Text>
							<Icon as={FaHeart} color="red.400" boxSize={3} />
							<Text>para tu negocio</Text>
						</HStack>
					</Flex>
				</Stack>
			</Container>
		</Box>
	);
}
