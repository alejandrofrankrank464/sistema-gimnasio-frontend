"use client";

import React, { memo } from "react";
import {
	Badge,
	Box,
	HStack,
	IconButton,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import {
	EditIcon,
	DeleteIcon,
	ChevronUpIcon,
	ChevronDownIcon,
	ViewIcon,
} from "@chakra-ui/icons";

const SortableHeader = ({
	field,
	currentField,
	direction,
	onSort,
	children,
}) => {
	const isActive = currentField === field;
	return (
		<Th
			cursor="pointer"
			onClick={() => onSort(field)}
			userSelect="none"
			_hover={{ bg: "gray.100" }}
		>
			<HStack spacing={1}>
				<span>{children}</span>
				{isActive &&
					(direction === "asc" ? (
						<ChevronUpIcon />
					) : (
						<ChevronDownIcon />
					))}
			</HStack>
		</Th>
	);
};

const ClienteRow = memo(function ClienteRow({
	cliente,
	index,
	currentPage,
	pageSize,
	onEdit,
	onDelete,
	onView,
	pagos,
}) {
	const a = (cliente && (cliente.attributes ?? cliente)) || {};
	const name = a.Name ?? a.name ?? "";
	const lastName = a.LastName ?? a.lastName ?? "";
	const phone = a.Phone ?? a.phone ?? "";
	const email = a.Email ?? a.email ?? "";
	const createdAt = cliente.createdAt || cliente.attributes?.createdAt;

	// Get current month payment to determine actual status
	const hoy = new Date();
	const mesActual = hoy.getMonth();
	const anioActual = hoy.getFullYear();
	const clienteId = cliente.documentId || cliente.id;

	const pagoMesActual = pagos.find((p) => {
		const attrs = p.attributes || p;
		const pagoClienteId =
			attrs.cliente?.documentId || attrs.cliente?.id || attrs.cliente;
		return (
			pagoClienteId === clienteId &&
			attrs.MesPago === mesActual &&
			attrs.AnioPago === anioActual
		);
	});

	const tipoServicio =
		pagoMesActual?.attributes?.TipoServicio || pagoMesActual?.TipoServicio;

	// Calculate status from current payment or fallback to cliente values
	const vip = tipoServicio
		? tipoServicio.includes("VIP")
		: a.Vip ?? a.vip ?? false;
	const zumba = tipoServicio
		? tipoServicio.includes("Zumba")
		: a.Zumba ?? a.zumba ?? false;
	const box = tipoServicio
		? tipoServicio.includes("Box")
		: a.Box ?? a.box ?? false;

	const formatDate = (dateString) => {
		if (!dateString) return "-";
		const date = new Date(dateString);
		return date.toLocaleDateString("es-ES", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		});
	};

	return (
		<Tr _hover={{ bg: "gray.50" }}>
			<Td>{(currentPage - 1) * pageSize + index + 1}</Td>
			<Td>{name}</Td>
			<Td>{lastName}</Td>
			<Td>{phone}</Td>
			<Td>{email || "-"}</Td>
			<Td>{formatDate(createdAt)}</Td>
			<Td>
				{vip ? (
					<Badge colorScheme="purple">VIP</Badge>
				) : (
					<Badge>Normal</Badge>
				)}
			</Td>
			<Td>
				{zumba && box ? (
					<Badge colorScheme="green">Ambos</Badge>
				) : box ? (
					<Badge colorScheme="blue">Box</Badge>
				) : zumba ? (
					<Badge colorScheme="orange">Zumba</Badge>
				) : (
					<Badge colorScheme="gray">No</Badge>
				)}
			</Td>
			<Td>
				<HStack justify="center" spacing={2}>
					<IconButton
						icon={<ViewIcon />}
						size="sm"
						colorScheme="teal"
						aria-label="Ver detalles"
						onClick={() => onView(cliente)}
					/>
					<IconButton
						icon={<EditIcon />}
						size="sm"
						colorScheme="blue"
						aria-label="Editar cliente"
						onClick={() => onEdit(cliente)}
					/>
					<IconButton
						icon={<DeleteIcon />}
						size="sm"
						colorScheme="red"
						aria-label="Eliminar cliente"
						onClick={() => onDelete(cliente)}
					/>
				</HStack>
			</Td>
		</Tr>
	);
});

export default function ClientesTable({
	clientes,
	currentPage,
	pageSize,
	onEdit,
	onDelete,
	onView,
	sortField,
	sortDirection,
	onSort,
	pagos,
}) {
	return (
		<Box overflowX="auto" borderWidth="1px" borderRadius="md">
			<Table variant="simple">
				<Thead bg="gray.50">
					<Tr>
						<Th>#</Th>
						<SortableHeader
							field="Name"
							currentField={sortField}
							direction={sortDirection}
							onSort={onSort}
						>
							Nombre
						</SortableHeader>
						<SortableHeader
							field="LastName"
							currentField={sortField}
							direction={sortDirection}
							onSort={onSort}
						>
							Apellido
						</SortableHeader>
						<SortableHeader
							field="Phone"
							currentField={sortField}
							direction={sortDirection}
							onSort={onSort}
						>
							Teléfono
						</SortableHeader>
						<SortableHeader
							field="Email"
							currentField={sortField}
							direction={sortDirection}
							onSort={onSort}
						>
							Email
						</SortableHeader>
						<SortableHeader
							field="createdAt"
							currentField={sortField}
							direction={sortDirection}
							onSort={onSort}
						>
							Fecha Registro
						</SortableHeader>
						<Th>VIP</Th>
						<Th>Zumba/Box</Th>
						<Th textAlign="center">Acciones</Th>
					</Tr>
				</Thead>
				<Tbody>
					{clientes.map((cliente, index) => (
						<ClienteRow
							key={cliente.documentId ?? cliente.id ?? index}
							cliente={cliente}
							pagos={pagos}
							index={index}
							currentPage={currentPage}
							pageSize={pageSize}
							onEdit={onEdit}
							onDelete={onDelete}
							onView={onView}
						/>
					))}
				</Tbody>
			</Table>
		</Box>
	);
}
