"use client";

import {
	Box,
	Heading,
	Text,
	SimpleGrid,
	Icon,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Iconos simulados con emojis para que sea más visual
const CardIcon = ({ emoji }) => (
	<Text fontSize="3xl" mb={2}>
		{emoji}
	</Text>
);

export default function NavigationCards() {
	const [stats, setStats] = useState({
		clientes: 0,
		pagos: 0,
		logs: 0,
	});

	useEffect(() => {
		// Cargar estadísticas básicas
		const fetchStats = async () => {
			try {
				const token = sessionStorage.getItem("token");

				// Obtener total de clientes
				const clientesRes = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/clientes?pagination[pageSize]=1`,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				const clientesData = await clientesRes.json();

				// Obtener pagos del mes actual
				const today = new Date();
				const mesActual = today.getMonth();
				const anioActual = today.getFullYear();

				const pagosRes = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/pagos?filters[MesPago][$eq]=${mesActual}&filters[AnioPago][$eq]=${anioActual}&pagination[pageSize]=1000`,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				const pagosData = await pagosRes.json();

				// Obtener logs recientes
				const logsRes = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/logs?pagination[pageSize]=1`,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				const logsData = await logsRes.json();

				setStats({
					clientes: clientesData.meta?.pagination?.total || 0,
					pagos: pagosData.data?.length || 0,
					logs: logsData.meta?.pagination?.total || 0,
				});
			} catch (error) {
				console.error("Error fetching stats:", error);
			}
		};

		fetchStats();
	}, []);

	const cards = [
		{
			href: "/clientes",
			title: "Clientes",
			description: "Registrar y gestionar clientes",
			emoji: "👥",
			stat: stats.clientes,
			statLabel: "Total de clientes",
		},
		{
			href: "/pagos",
			title: "Pagos",
			description: "Gestionar pagos mensuales",
			emoji: "💰",
			stat: stats.pagos,
			statLabel: "Pagos este mes",
		},
		{
			href: "/horario",
			title: "Horario",
			description: "Ver horario semanal de turnos",
			emoji: "📅",
			stat: null,
			statLabel: "Lun-Sáb: 7:00-20:00",
		},
		{
			href: "/reportes",
			title: "Reportes",
			description: "Historial y actividad",
			emoji: "📊",
			stat: stats.logs,
			statLabel: "Registros de actividad",
		},
	];

	return (
		<SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
			{cards.map((card) => (
				<Link key={card.href} href={card.href}>
					<Box
						p={6}
						borderWidth="2px"
						borderRadius="lg"
						_hover={{
							bg: "teal.50",
							borderColor: "teal.500",
							transform: "translateY(-4px)",
							shadow: "lg",
						}}
						transition="all 0.3s"
						cursor="pointer"
						bg="white"
						height="100%"
					>
						<CardIcon emoji={card.emoji} />
						<Heading size="md" mb={2}>
							{card.title}
						</Heading>
						<Text fontSize="sm" color="gray.600" mb={4}>
							{card.description}
						</Text>

						<Stat>
							{card.stat !== null ? (
								<>
									<StatNumber fontSize="2xl" color="teal.600">
										{card.stat}
									</StatNumber>
									<StatLabel fontSize="xs" color="gray.500">
										{card.statLabel}
									</StatLabel>
								</>
							) : (
								<StatLabel fontSize="xs" color="gray.500">
									{card.statLabel}
								</StatLabel>
							)}
						</Stat>
					</Box>
				</Link>
			))}
		</SimpleGrid>
	);
}
