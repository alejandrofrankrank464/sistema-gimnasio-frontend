"use client";

import {
	Box,
	Heading,
	Text,
	VStack,
	HStack,
	Badge,
	Spinner,
	Avatar,
	Flex,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { TimeIcon } from "@chakra-ui/icons";

const ACCIONES = {
	crear_cliente: { label: "Nuevo cliente", color: "green", emoji: "➕" },
	editar_cliente: { label: "Cliente editado", color: "blue", emoji: "✏️" },
	eliminar_cliente: { label: "Cliente eliminado", color: "red", emoji: "🗑️" },
	crear_pago: { label: "Nuevo pago", color: "green", emoji: "💵" },
	editar_pago: { label: "Pago editado", color: "blue", emoji: "✏️" },
	eliminar_pago: { label: "Pago eliminado", color: "red", emoji: "🗑️" },
};

export default function RecentActivity() {
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRecentLogs = async () => {
			try {
				const token = sessionStorage.getItem("token");
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/logs?pagination[pageSize]=10&sort=createdAt:desc`,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				const data = await res.json();
				setLogs(data.data || []);
			} catch (error) {
				console.error("Error fetching logs:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchRecentLogs();
	}, []);

	const formatTime = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return "Hace un momento";
		if (diffMins < 60) return `Hace ${diffMins} min`;
		if (diffHours < 24) return `Hace ${diffHours}h`;
		if (diffDays < 7) return `Hace ${diffDays}d`;
		return date.toLocaleDateString("es-ES", {
			day: "numeric",
			month: "short",
		});
	};

	if (loading) {
		return (
			<Box p={6} borderWidth="1px" borderRadius="lg" bg="white">
				<Flex justify="center" align="center" py={10}>
					<Spinner color="teal.500" />
				</Flex>
			</Box>
		);
	}

	return (
		<Box p={6} borderWidth="1px" borderRadius="lg" bg="white">
			<Heading size="md" mb={4}>
				<HStack>
					<TimeIcon color="teal.500" />
					<Text>Actividad Reciente</Text>
				</HStack>
			</Heading>

			<VStack spacing={3} align="stretch">
				{logs.length === 0 ? (
					<Text color="gray.500" textAlign="center" py={4}>
						No hay actividad reciente
					</Text>
				) : (
					logs.map((log) => {
						const attrs = log.attributes || log;
						const accionInfo = ACCIONES[attrs.Accion] || {
							label: attrs.Accion,
							color: "gray",
							emoji: "📝",
						};

						return (
							<HStack
								key={log.id}
								p={3}
								borderRadius="md"
								_hover={{ bg: "gray.50" }}
								spacing={3}
								align="start"
							>
								<Text fontSize="xl">{accionInfo.emoji}</Text>
								<Box flex="1">
									<HStack spacing={2} mb={1}>
										<Badge
											colorScheme={accionInfo.color}
											fontSize="xs"
										>
											{accionInfo.label}
										</Badge>
										<Text fontSize="xs" color="gray.500">
											{formatTime(attrs.createdAt)}
										</Text>
									</HStack>
									<Text fontSize="sm" fontWeight="semibold">
										{attrs.NombreCompleto || "Sin nombre"}
									</Text>
									<Text fontSize="xs" color="gray.600">
										Por: {attrs.Usuario || "Sistema"}
									</Text>
								</Box>
							</HStack>
						);
					})
				)}
			</VStack>
		</Box>
	);
}
