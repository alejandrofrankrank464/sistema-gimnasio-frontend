import { useState } from "react";
import {
	Card,
	CardBody,
	CardHeader,
	Heading,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Badge,
	Button,
	Text,
	Flex,
	Box,
} from "@chakra-ui/react";
import {
	formatDate,
	formatMonto,
	getTurnoIcon,
	formatMesPago,
} from "../../pagos/formatters";

export default function ClientePagosTable({ pagos }) {
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10;

	// Paginación
	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	const paginatedPagos = pagos.slice(startIndex, endIndex);
	const totalPages = Math.ceil(pagos.length / pageSize);

	return (
		<Card shadow="md">
			<CardHeader>
				<Box>
					<Heading size="md">Historial de Pagos</Heading>
					<Text fontSize="sm" color="gray.600" mt={1}>
						Total: {pagos.length} pagos registrados
					</Text>
				</Box>
			</CardHeader>
			<CardBody>
				{pagos.length === 0 ? (
					<Text color="gray.500" textAlign="center" py={8}>
						No hay pagos registrados para este cliente
					</Text>
				) : (
					<>
						<Table variant="simple" size="sm">
							<Thead>
								<Tr>
									<Th>Fecha de Pago</Th>
									<Th>Mes Pagado</Th>
									<Th>Monto</Th>
									<Th>Turno</Th>
									<Th>Método de Pago</Th>
								</Tr>
							</Thead>
							<Tbody>
								{paginatedPagos.map((pago) => {
									const attrs = pago.attributes || pago;
									return (
										<Tr key={pago.documentId || pago.id}>
											<Td>
												{formatDate(attrs.FechaPago)}
											</Td>{" "}
											<Td>
												<Badge
													colorScheme="teal"
													variant="subtle"
												>
													{formatMesPago(
														attrs.MesPago,
														attrs.AnioPago
													)}
												</Badge>
											</Td>{" "}
											<Td fontWeight="bold">
												{formatMonto(attrs.Monto)}
											</Td>
											<Td>
												{attrs.Turno ? (
													<Badge
														colorScheme="cyan"
														variant="subtle"
														fontSize="sm"
														fontWeight="bold"
														display="inline-flex"
														alignItems="center"
														gap={1}
													>
														{getTurnoIcon(
															attrs.Turno
														)}
														{attrs.Turno}
													</Badge>
												) : attrs.TipoServicio?.includes(
														"VIP"
												  ) ? (
													<Badge
														colorScheme="purple"
														fontSize="sm"
														fontWeight="bold"
													>
														Todos los turnos
													</Badge>
												) : (
													<Text color="gray.400">
														-
													</Text>
												)}
											</Td>
											<Td>
												<Badge colorScheme="blue">
													{attrs.MetodoPago ||
														"No especificado"}
												</Badge>
											</Td>
										</Tr>
									);
								})}
							</Tbody>
						</Table>

						{/* Paginación */}
						{totalPages > 1 && (
							<Flex
								justify="center"
								align="center"
								mt={4}
								gap={2}
							>
								<Button
									size="sm"
									onClick={() =>
										setCurrentPage(currentPage - 1)
									}
									isDisabled={currentPage === 1}
								>
									Anterior
								</Button>
								<Text fontSize="sm">
									Página {currentPage} de {totalPages}
								</Text>
								<Button
									size="sm"
									onClick={() =>
										setCurrentPage(currentPage + 1)
									}
									isDisabled={currentPage === totalPages}
								>
									Siguiente
								</Button>
							</Flex>
						)}
					</>
				)}
			</CardBody>
		</Card>
	);
}
