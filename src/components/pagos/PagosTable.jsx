import {
	Box,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Badge,
	Flex,
	HStack,
	IconButton,
} from "@chakra-ui/react";
import {
	EditIcon,
	DeleteIcon,
	TriangleUpIcon,
	TriangleDownIcon,
} from "@chakra-ui/icons";
import {
	formatDate,
	formatMonto,
	formatTurno,
	getTurnoIcon,
} from "./formatters";

export default function PagosTable({
	sortedPagos,
	sortField,
	sortDirection,
	handleSort,
	handleEdit,
	handleDelete,
}) {
	return (
		<Box overflowX="auto" borderWidth="1px" borderRadius="md">
			<Table variant="simple">
				<Thead bg="gray.50">
					<Tr>
						<Th
							cursor="pointer"
							onClick={() => handleSort("Cliente")}
							_hover={{ bg: "gray.100" }}
							userSelect="none"
						>
							<Flex align="center" gap={2}>
								Cliente
								{sortField === "Cliente" &&
									(sortDirection === "asc" ? (
										<TriangleUpIcon boxSize={3} />
									) : (
										<TriangleDownIcon boxSize={3} />
									))}
							</Flex>
						</Th>
						<Th
							cursor="pointer"
							onClick={() => handleSort("Telefono")}
							_hover={{ bg: "gray.100" }}
							userSelect="none"
						>
							<Flex align="center" gap={2}>
								Teléfono
								{sortField === "Telefono" &&
									(sortDirection === "asc" ? (
										<TriangleUpIcon boxSize={3} />
									) : (
										<TriangleDownIcon boxSize={3} />
									))}
							</Flex>
						</Th>
						<Th
							cursor="pointer"
							onClick={() => handleSort("Monto")}
							_hover={{ bg: "gray.100" }}
							userSelect="none"
						>
							<Flex align="center" gap={2}>
								Monto
								{sortField === "Monto" &&
									(sortDirection === "asc" ? (
										<TriangleUpIcon boxSize={3} />
									) : (
										<TriangleDownIcon boxSize={3} />
									))}
							</Flex>
						</Th>
						<Th
							cursor="pointer"
							onClick={() => handleSort("Metodo")}
							_hover={{ bg: "gray.100" }}
							userSelect="none"
						>
							<Flex align="center" gap={2}>
								Método
								{sortField === "Metodo" &&
									(sortDirection === "asc" ? (
										<TriangleUpIcon boxSize={3} />
									) : (
										<TriangleDownIcon boxSize={3} />
									))}
							</Flex>
						</Th>
						<Th>Turno</Th>
						<Th
							cursor="pointer"
							onClick={() => handleSort("TipoServicio")}
							_hover={{ bg: "gray.100" }}
							userSelect="none"
						>
							<Flex align="center" gap={2}>
								Tipo Servicio
								{sortField === "TipoServicio" &&
									(sortDirection === "asc" ? (
										<TriangleUpIcon boxSize={3} />
									) : (
										<TriangleDownIcon boxSize={3} />
									))}
							</Flex>
						</Th>
						<Th
							cursor="pointer"
							onClick={() => handleSort("FechaPago")}
							_hover={{ bg: "gray.100" }}
							userSelect="none"
						>
							<Flex align="center" gap={2}>
								Fecha Pago
								{sortField === "FechaPago" &&
									(sortDirection === "asc" ? (
										<TriangleUpIcon boxSize={3} />
									) : (
										<TriangleDownIcon boxSize={3} />
									))}
							</Flex>
						</Th>
						<Th textAlign="center">Acciones</Th>
					</Tr>
				</Thead>
				<Tbody>
					{sortedPagos.map((pago) => {
						const attrs = pago.attributes || pago;
						const clienteAttrs = attrs.cliente || {};
						const clienteName =
							`${clienteAttrs.Name || ""} ${
								clienteAttrs.LastName || ""
							}`.trim() || "Cliente Eliminado";
						const clientePhone = clienteAttrs.Phone || "-";

						return (
							<Tr
								key={pago.documentId ?? pago.id}
								_hover={{ bg: "gray.50" }}
							>
								<Td fontWeight="medium">{clienteName}</Td>
								<Td>{clientePhone}</Td>
								<Td>{formatMonto(attrs.Monto)}</Td>
								<Td>
									<Badge
										colorScheme={
											attrs.MetodoPago === "Efectivo"
												? "green"
												: "blue"
										}
									>
										{attrs.MetodoPago || "-"}
									</Badge>
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
											{getTurnoIcon(attrs.Turno)}
											{formatTurno(attrs.Turno)}
										</Badge>
									) : (
										<Badge
											colorScheme="purple"
											fontSize="sm"
											fontWeight="bold"
										>
											VIP - Todos los turnos
										</Badge>
									)}
								</Td>
								<Td>
									<Badge
										colorScheme={
											attrs.TipoServicio === "VIP"
												? "purple"
												: attrs.TipoServicio ===
												  "Box/Zumba"
												? "orange"
												: "gray"
										}
									>
										{attrs.TipoServicio}
									</Badge>
								</Td>
								<Td>{formatDate(attrs.FechaPago)}</Td>
								<Td>
									<HStack justify="center" spacing={2}>
										<IconButton
											icon={<EditIcon />}
											size="sm"
											colorScheme="blue"
											aria-label="Editar pago"
											onClick={() => handleEdit(pago)}
										/>
										<IconButton
											icon={<DeleteIcon />}
											size="sm"
											colorScheme="red"
											aria-label="Eliminar pago"
											onClick={() => handleDelete(pago)}
										/>
									</HStack>
								</Td>
							</Tr>
						);
					})}
				</Tbody>
			</Table>
		</Box>
	);
}
