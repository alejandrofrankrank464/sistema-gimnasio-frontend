"use client";

import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Badge,
	VStack,
	Text,
	Card,
	CardBody,
} from "@chakra-ui/react";
import ClientePopover from "./ClientePopover";

export default function HorarioTable({
	weekDays,
	hours,
	getClientesForDay,
	getClientesVIPTodoElDia,
	getPagoActivo,
}) {
	const formatDate = (date) => {
		return date.toLocaleDateString("es-ES", {
			day: "numeric",
			month: "short",
		});
	};

	const getDayName = (date) => {
		const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
		return days[date.getDay() - 1];
	};

	return (
		<Card>
			<CardBody overflowX="auto">
				<Table size="sm" variant="simple">
					<Thead>
						<Tr>
							<Th
								position="sticky"
								left={0}
								bg="white"
								zIndex={2}
								borderRightWidth="2px"
							>
								Hora
							</Th>
							{weekDays.map((day, idx) => (
								<Th key={idx} textAlign="center" minW="150px">
									<VStack spacing={0}>
										<Text fontWeight="bold">
											{getDayName(day)}
										</Text>
										<Text fontSize="xs" fontWeight="normal">
											{formatDate(day)}
										</Text>
										{idx === 5 && (
											<Badge
												colorScheme="purple"
												fontSize="xs"
												mt={1}
											>
												Zumba/Box
											</Badge>
										)}
									</VStack>
								</Th>
							))}
						</Tr>
					</Thead>
					<Tbody>
						{hours.map((hour) => (
							<Tr key={hour}>
								<Td
									position="sticky"
									left={0}
									bg="gray.50"
									fontWeight="semibold"
									borderRightWidth="2px"
									zIndex={1}
								>
									{hour.toString().padStart(2, "0")}:00
								</Td>
								{weekDays.map((day, dayIdx) => {
									const clientesEnHora = getClientesForDay(
										dayIdx,
										hour
									);
									const numClientes = clientesEnHora.length;

									return (
										<Td
											key={dayIdx}
											bg={
												numClientes > 0
													? "teal.50"
													: "white"
											}
											verticalAlign="top"
											p={2}
											textAlign="center"
										>
											{numClientes > 0 && (
												<ClientePopover
													clientes={clientesEnHora}
													colorScheme="teal"
													buttonText={`${numClientes} ${
														numClientes === 1
															? "cliente"
															: "clientes"
													}`}
													getPagoActivo={
														getPagoActivo
													}
													dayDate={weekDays[dayIdx]}
													showVIPBadge={true}
												/>
											)}
										</Td>
									);
								})}
							</Tr>
						))}

						{/* Fila especial para VIP todo el día */}
						<Tr bg="purple.50">
							<Td
								position="sticky"
								left={0}
								bg="purple.100"
								fontWeight="bold"
								borderRightWidth="2px"
								zIndex={1}
								fontSize="xs"
							>
								VIP
								<br />
								<Text fontSize="2xs" fontWeight="normal">
									(Todo el día)
								</Text>
							</Td>
							{weekDays.map((day, dayIdx) => {
								const clientesVIP =
									getClientesVIPTodoElDia(dayIdx);
								const numVIP = clientesVIP.length;

								return (
									<Td
										key={dayIdx}
										verticalAlign="top"
										p={2}
										textAlign="center"
									>
										{numVIP > 0 && (
											<ClientePopover
												clientes={clientesVIP}
												colorScheme="purple"
												buttonText={`${numVIP} VIP`}
												getPagoActivo={getPagoActivo}
												dayDate={weekDays[dayIdx]}
												showVIPBadge={false}
											/>
										)}
									</Td>
								);
							})}
						</Tr>
					</Tbody>
				</Table>
			</CardBody>
		</Card>
	);
}
