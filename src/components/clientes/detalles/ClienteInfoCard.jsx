import {
	Card,
	CardBody,
	CardHeader,
	Heading,
	SimpleGrid,
	Box,
	Text,
	Badge,
	HStack,
	VStack,
} from "@chakra-ui/react";
import { formatDate } from "../../pagos/formatters";

export default function ClienteInfoCard({ cliente, pagos }) {
	// Obtener turno del pago del mes actual
	const hoy = new Date();
	const mesActual = hoy.getMonth();
	const anioActual = hoy.getFullYear();

	const pagoMesActual = pagos.find((p) => {
		const attrs = p.attributes || p;
		return attrs.MesPago === mesActual && attrs.AnioPago === anioActual;
	});

	const turnoActual =
		pagoMesActual?.attributes?.Turno ||
		pagoMesActual?.Turno ||
		cliente.Turno ||
		"No especificado";

	const tipoServicio =
		pagoMesActual?.attributes?.TipoServicio || pagoMesActual?.TipoServicio;
	const esVIP = tipoServicio
		? tipoServicio.includes("VIP")
		: cliente.Vip ?? cliente.vip ?? false;
	const tieneZumba = tipoServicio
		? tipoServicio.includes("Zumba")
		: cliente.Zumba ?? cliente.zumba ?? false;
	const tieneBox = tipoServicio
		? tipoServicio.includes("Box")
		: cliente.Box ?? cliente.box ?? false;

	return (
		<Card flex={1} shadow="md">
			<CardHeader pb={2}>
				<Heading size="md">Información Personal</Heading>
			</CardHeader>
			<CardBody>
				<VStack spacing={4} align="stretch">
					<InfoRow
						label="Nombre Completo"
						value={`${cliente.Name} ${cliente.LastName}`}
					/>
					<InfoRow
						label="Teléfono"
						value={cliente.Phone || "No registrado"}
					/>
					<InfoRow
						label="Email"
						value={cliente.Email || "No registrado"}
					/>

					<Box>
						<Text
							fontSize="sm"
							fontWeight="medium"
							color="gray.600"
							mb={2}
						>
							Estado
						</Text>
						<HStack>
							<Badge colorScheme={esVIP ? "purple" : "gray"}>
								{esVIP ? "VIP" : "Normal"}
							</Badge>
							{tieneZumba && (
								<Badge colorScheme="pink">Zumba</Badge>
							)}
							{tieneBox && (
								<Badge colorScheme="orange">Box</Badge>
							)}
						</HStack>
					</Box>

					<InfoRow
						label="Turno Actual"
						value={
							turnoActual ||
							(esVIP ? "Todos los turnos" : "No especificado")
						}
					/>

					<InfoRow
						label="Fecha de Registro"
						value={formatDate(cliente.createdAt)}
					/>
				</VStack>
			</CardBody>
		</Card>
	);
}

function InfoRow({ label, value }) {
	return (
		<Box>
			<Text fontSize="sm" fontWeight="medium" color="gray.600">
				{label}
			</Text>
			<Text fontSize="md" mt={1}>
				{value}
			</Text>
		</Box>
	);
}
