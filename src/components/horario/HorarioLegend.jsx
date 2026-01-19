"use client";

import {
	Box,
	Badge,
	Heading,
	HStack,
	Text,
	Card,
	CardBody,
} from "@chakra-ui/react";

export default function HorarioLegend() {
	return (
		<Card>
			<CardBody>
				<Heading size="sm" mb={3}>
					Leyenda
				</Heading>
				<HStack spacing={6} flexWrap="wrap">
					<HStack>
						<Box w={4} h={4} bg="teal.50" borderRadius="sm" />
						<Text fontSize="sm">Clientes agendados</Text>
					</HStack>
					<HStack>
						<Box w={4} h={4} bg="purple.100" borderRadius="sm" />
						<Text fontSize="sm">VIP (todo el día)</Text>
					</HStack>
					<HStack>
						<Badge colorScheme="purple">Zumba/Box</Badge>
						<Text fontSize="sm">Solo sábados</Text>
					</HStack>
					<HStack>
						<Box w={4} h={4} bg="gray.50" borderRadius="sm" />
						<Text fontSize="sm">Sin clientes</Text>
					</HStack>
				</HStack>
				<Text fontSize="xs" color="gray.500" mt={3}>
					* Solo se muestran clientes con pagos activos (antes del día
					10 de cada mes)
					<br />* Click en los botones para ver la lista de clientes
				</Text>
			</CardBody>
		</Card>
	);
}
