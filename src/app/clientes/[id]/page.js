"use client";

import { useState, useEffect, useCallback, use } from "react";
import {
	Box,
	Container,
	Heading,
	Spinner,
	Flex,
	Text,
	useToast,
	Button,
	HStack,
	VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ClienteInfoCard from "@/components/clientes/detalles/ClienteInfoCard";
import ClienteStatsCard from "@/components/clientes/detalles/ClienteStatsCard";
import ClientePagosTable from "@/components/clientes/detalles/ClientePagosTable";

export default function ClienteDetallePage({ params }) {
	const { id } = use(params);
	const router = useRouter();
	const toast = useToast();
	const [cliente, setCliente] = useState(null);
	const [pagos, setPagos] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchClienteData = useCallback(async () => {
		setLoading(true);
		try {
			const token = sessionStorage.getItem("token");

			// Fetch cliente data
			const clienteRes = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/clientes/${id}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (!clienteRes.ok) throw new Error("Error al cargar cliente");
			const clienteData = await clienteRes.json();

			// Fetch pagos del cliente
			const pagosRes = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/pagos?filters[cliente][documentId][$eq]=${id}&sort=FechaPago:desc&pagination[pageSize]=1000`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (!pagosRes.ok) throw new Error("Error al cargar pagos");
			const pagosData = await pagosRes.json();

			// Ordenar pagos por mes pagado (más antiguo primero - ascendente)
			const pagosSorted = (pagosData.data || []).sort((a, b) => {
				const attrsA = a.attributes || a;
				const attrsB = b.attributes || b;

				// Primero comparar por año
				if (attrsA.AnioPago !== attrsB.AnioPago) {
					return attrsA.AnioPago - attrsB.AnioPago;
				}
				// Si el año es igual, comparar por mes
				return attrsA.MesPago - attrsB.MesPago;
			});

			setCliente(clienteData.data);
			setPagos(pagosSorted);
		} catch (error) {
			toast({
				title: "Error",
				description: error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			router.push("/clientes");
		} finally {
			setLoading(false);
		}
	}, [id, router, toast]);

	useEffect(() => {
		fetchClienteData();
	}, [fetchClienteData]);

	if (loading) {
		return (
			<Flex minH="100vh" justify="center" align="center" bg="gray.50">
				<Spinner size="xl" color="teal.500" />
			</Flex>
		);
	}

	if (!cliente) {
		return (
			<Box minH="100vh" bg="gray.50" py={6}>
				<Container maxW="1200px">
					<Text>Cliente no encontrado</Text>
				</Container>
			</Box>
		);
	}

	const attrs = cliente.attributes || cliente;

	return (
		<Box minH="100vh" bg="gray.50" py={6}>
			<Container maxW="1200px">
				<VStack spacing={6} align="stretch">
					{/* Header */}
					<Flex justify="space-between" align="center">
						<VStack align="start" spacing={1}>
							<Heading size="lg">
								{attrs.Name} {attrs.LastName}
							</Heading>
							<Text color="gray.600">Detalles del cliente</Text>
						</VStack>
						<Button
							leftIcon={<ArrowBackIcon />}
							variant="outline"
							onClick={() => router.push("/clientes")}
						>
							Volver a Clientes
						</Button>
					</Flex>

					{/* Info and Stats Cards */}
					<HStack spacing={6} align="stretch">
						<ClienteInfoCard cliente={attrs} pagos={pagos} />
						<ClienteStatsCard pagos={pagos} />
					</HStack>

					{/* Pagos Table */}
					<ClientePagosTable pagos={pagos} />
				</VStack>
			</Container>
		</Box>
	);
}
