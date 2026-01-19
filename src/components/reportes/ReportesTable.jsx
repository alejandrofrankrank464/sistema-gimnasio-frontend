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
} from "@chakra-ui/react";
import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import { ACCIONES } from "./constants";
import { formatDate, formatNombre, formatDetalles } from "./formatters";

export default function ReportesTable({
	paginatedLogs,
	sortField,
	sortDirection,
	handleSort,
}) {
	return (
		<Box overflowX="auto" borderWidth="1px" borderRadius="md">
			<Table variant="simple" size="sm">
				<Thead bg="gray.50">
					<Tr>
						<Th
							cursor="pointer"
							onClick={() => handleSort("createdAt")}
							_hover={{ bg: "gray.100" }}
							userSelect="none"
						>
							<Flex align="center" gap={2}>
								Fecha y Hora
								{sortField === "createdAt" &&
									(sortDirection === "asc" ? (
										<TriangleUpIcon boxSize={3} />
									) : (
										<TriangleDownIcon boxSize={3} />
									))}
							</Flex>
						</Th>
						<Th
							cursor="pointer"
							onClick={() => handleSort("Accion")}
							_hover={{ bg: "gray.100" }}
							userSelect="none"
						>
							<Flex align="center" gap={2}>
								Acción
								{sortField === "Accion" &&
									(sortDirection === "asc" ? (
										<TriangleUpIcon boxSize={3} />
									) : (
										<TriangleDownIcon boxSize={3} />
									))}
							</Flex>
						</Th>
						<Th
							cursor="pointer"
							onClick={() => handleSort("Entidad")}
							_hover={{ bg: "gray.100" }}
							userSelect="none"
						>
							<Flex align="center" gap={2}>
								Entidad
								{sortField === "Entidad" &&
									(sortDirection === "asc" ? (
										<TriangleUpIcon boxSize={3} />
									) : (
										<TriangleDownIcon boxSize={3} />
									))}
							</Flex>
						</Th>
						<Th
							cursor="pointer"
							onClick={() => handleSort("NombreCompleto")}
							_hover={{ bg: "gray.100" }}
							userSelect="none"
						>
							<Flex align="center" gap={2}>
								Nombre
								{sortField === "NombreCompleto" &&
									(sortDirection === "asc" ? (
										<TriangleUpIcon boxSize={3} />
									) : (
										<TriangleDownIcon boxSize={3} />
									))}
							</Flex>
						</Th>
						<Th>Usuario</Th>
						<Th>Detalles</Th>
					</Tr>
				</Thead>
				<Tbody>
					{paginatedLogs.map((log) => {
						const attrs = log.attributes || log;
						const accionInfo = ACCIONES[attrs.Accion] || {
							label: attrs.Accion,
							color: "gray",
						};

						return (
							<Tr
								key={log.documentId ?? log.id}
								_hover={{ bg: "gray.50" }}
							>
								<Td fontSize="xs">
									{formatDate(
										attrs.createdAt || log.createdAt
									)}
								</Td>
								<Td>
									<Badge
										colorScheme={accionInfo.color}
										fontSize="xs"
									>
										{accionInfo.label}
									</Badge>
								</Td>
								<Td>
									<Badge variant="outline" fontSize="xs">
										{attrs.Entidad}
									</Badge>
								</Td>
								<Td fontWeight="medium" fontSize="sm">
									{formatNombre(
										attrs.NombreCompleto,
										attrs.Detalles,
										attrs.Accion
									)}
								</Td>
								<Td fontSize="xs">
									<Badge colorScheme="gray" fontSize="xs">
										{attrs.Usuario || "Sistema"}
									</Badge>
								</Td>
								<Td fontSize="xs" maxW="300px">
									{formatDetalles(
										attrs.Detalles,
										attrs.Accion
									)}
								</Td>
							</Tr>
						);
					})}
				</Tbody>
			</Table>
		</Box>
	);
}
