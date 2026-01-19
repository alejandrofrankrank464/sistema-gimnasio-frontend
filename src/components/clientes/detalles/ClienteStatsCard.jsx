import {
	Card,
	CardBody,
	CardHeader,
	Heading,
	SimpleGrid,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	Box,
	Text,
} from "@chakra-ui/react";

export default function ClienteStatsCard({ pagos }) {
	// Calcular estadísticas
	const totalPagado = pagos.reduce((sum, pago) => {
		const monto = pago.attributes?.Monto || pago.Monto || 0;
		return sum + monto;
	}, 0);

	const ultimoPago = pagos.length > 0 ? pagos[0] : null;
	const ultimoPagoMonto =
		ultimoPago?.attributes?.Monto || ultimoPago?.Monto || 0;
	const ultimoPagoFecha =
		ultimoPago?.attributes?.FechaPago || ultimoPago?.FechaPago;

	const promedioMensual = pagos.length > 0 ? totalPagado / pagos.length : 0;

	// Calcular días para vencimiento de mensualidad
	let diasParaVencimiento = null;
	let estadoPago = "Sin pagos";

	if (pagos.length > 0) {
		const hoy = new Date();
		const mesActual = hoy.getMonth();
		const anioActual = hoy.getFullYear();

		// Buscar el último pago realizado por mes
		const ultimoPagoPorMes = pagos.reduce((ultimo, pago) => {
			const attrs = pago.attributes || pago;
			if (!ultimo) return attrs;

			// Comparar año y mes para encontrar el más reciente
			if (attrs.AnioPago > ultimo.AnioPago) return attrs;
			if (
				attrs.AnioPago === ultimo.AnioPago &&
				attrs.MesPago > ultimo.MesPago
			)
				return attrs;
			return ultimo;
		}, null);

		if (ultimoPagoPorMes) {
			const mesPagado = ultimoPagoPorMes.MesPago;
			const anioPagado = ultimoPagoPorMes.AnioPago;

			// El pago del mes X vence el día 10 del mes X+1
			const mesVencimiento = mesPagado === 11 ? 0 : mesPagado + 1;
			const anioVencimiento =
				mesPagado === 11 ? anioPagado + 1 : anioPagado;
			const vencimiento = new Date(anioVencimiento, mesVencimiento, 10);

			diasParaVencimiento = Math.ceil(
				(vencimiento - hoy) / (1000 * 60 * 60 * 24)
			);

			// Determinar estado
			if (
				mesPagado > mesActual ||
				(mesPagado === mesActual && anioPagado > anioActual)
			) {
				estadoPago = "Adelantado";
			} else if (diasParaVencimiento >= 0) {
				estadoPago = "Al día";
			} else {
				estadoPago = "Vencido";
			}
		}
	}

	return (
		<Card flex={1} shadow="md">
			<CardHeader pb={2}>
				<Heading size="md">Estadísticas de Pagos</Heading>
			</CardHeader>
			<CardBody>
				<SimpleGrid columns={2} spacing={4}>
					<Stat>
						<StatLabel>Total Pagado</StatLabel>
						<StatNumber color="green.500">
							${totalPagado.toLocaleString()}
						</StatNumber>
						<StatHelpText>{pagos.length} pagos</StatHelpText>
					</Stat>

					<Stat>
						<StatLabel>Último Pago</StatLabel>
						<StatNumber color="blue.500">
							${ultimoPagoMonto.toLocaleString()}
						</StatNumber>
						<StatHelpText>
							{ultimoPagoFecha
								? new Date(ultimoPagoFecha).toLocaleDateString()
								: "Sin pagos"}
						</StatHelpText>
					</Stat>

					<Stat>
						<StatLabel>Promedio por Pago</StatLabel>
						<StatNumber color="purple.500">
							${Math.round(promedioMensual).toLocaleString()}
						</StatNumber>
						<StatHelpText>Aproximado</StatHelpText>
					</Stat>

					<Stat>
						<StatLabel>Estado de Mensualidad</StatLabel>
						<StatNumber
							color={
								diasParaVencimiento === null
									? "gray.500"
									: estadoPago === "Vencido"
									? "red.500"
									: diasParaVencimiento <= 5
									? "orange.500"
									: "green.500"
							}
						>
							{diasParaVencimiento !== null
								? `${Math.abs(diasParaVencimiento)} días`
								: "N/A"}
						</StatNumber>
						<StatHelpText>{estadoPago}</StatHelpText>
					</Stat>
				</SimpleGrid>
			</CardBody>
		</Card>
	);
}
