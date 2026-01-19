"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
	Box,
	useToast,
	Spinner,
	Text,
	Flex,
	useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import ReportesHeader from "./ReportesHeader";
import ReportesFilters from "./ReportesFilters";
import ReportesTable from "./ReportesTable";
import ReportesPagination from "./ReportesPagination";
import DeleteAllDialog from "./DeleteAllDialog";
import { PAGE_SIZE } from "./constants";

export default function Reportes() {
	const router = useRouter();
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filterEntidad, setFilterEntidad] = useState("Todos");
	const [filterAccion, setFilterAccion] = useState("Todas");
	const [sortField, setSortField] = useState("createdAt");
	const [sortDirection, setSortDirection] = useState("desc");
	const [currentPage, setCurrentPage] = useState(1);
	const [deletingAll, setDeletingAll] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef();
	const toast = useToast();

	const handleCloseDialog = useCallback(() => {
		setDeletingAll(false);
		onClose();
	}, [onClose]);

	const fetchLogs = useCallback(async () => {
		setLoading(true);
		try {
			const token = sessionStorage.getItem("token");
			const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/logs`);
			url.searchParams.set("pagination[pageSize]", "1000");
			url.searchParams.set("sort", "createdAt:desc");

			const res = await fetch(url.toString(), {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (!res.ok) throw new Error("Error al cargar logs");
			const data = await res.json();
			setLogs(data.data || []);
		} catch (error) {
			toast({
				title: "Error",
				description: error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	}, [toast]);

	const handleDeleteAllLogs = useCallback(async () => {
		setDeletingAll(true);
		try {
			const token = sessionStorage.getItem("token");

			// Obtener todos los IDs de logs
			for (const log of logs) {
				const id = log.documentId || log.id;
				await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/logs/${id}`,
					{
						method: "DELETE",
						headers: { Authorization: `Bearer ${token}` },
					}
				);
			}

			toast({
				title: "Éxito",
				description: `${logs.length} registros eliminados`,
				status: "success",
				duration: 3000,
				isClosable: true,
			});

			setLogs([]);
		} catch (error) {
			toast({
				title: "Error",
				description: "Error al eliminar registros",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setDeletingAll(false);
			// Pequeño delay para asegurar que el estado se actualice antes de cerrar
			setTimeout(() => {
				onClose();
			}, 100);
		}
	}, [logs, toast, onClose]);

	useEffect(() => {
		fetchLogs();
	}, [fetchLogs]);

	const handleSort = (field) => {
		if (sortField === field) {
			setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const filteredAndSortedLogs = useMemo(() => {
		let filtered = logs;

		// Filter by entity
		if (filterEntidad !== "Todos") {
			filtered = filtered.filter((log) => {
				const attrs = log.attributes || log;
				return attrs.Entidad === filterEntidad;
			});
		}

		// Filter by action
		if (filterAccion !== "Todas") {
			filtered = filtered.filter((log) => {
				const attrs = log.attributes || log;
				return attrs.Accion === filterAccion;
			});
		}

		// Sort
		const sorted = [...filtered].sort((a, b) => {
			const aAttrs = a.attributes || a;
			const bAttrs = b.attributes || b;

			let aVal, bVal;

			switch (sortField) {
				case "Accion":
					aVal = aAttrs.Accion || "";
					bVal = bAttrs.Accion || "";
					break;
				case "Entidad":
					aVal = aAttrs.Entidad || "";
					bVal = bAttrs.Entidad || "";
					break;
				case "NombreCompleto":
					aVal = aAttrs.NombreCompleto || "";
					bVal = bAttrs.NombreCompleto || "";
					break;
				case "createdAt":
					aVal = aAttrs.createdAt || a.createdAt || "";
					bVal = bAttrs.createdAt || b.createdAt || "";
					break;
				default:
					return 0;
			}

			if (sortDirection === "asc") {
				return aVal.localeCompare(bVal);
			} else {
				return bVal.localeCompare(aVal);
			}
		});

		return sorted;
	}, [logs, filterEntidad, filterAccion, sortField, sortDirection]);

	// Paginación
	const paginatedLogs = useMemo(() => {
		const startIndex = (currentPage - 1) * PAGE_SIZE;
		const endIndex = startIndex + PAGE_SIZE;
		return filteredAndSortedLogs.slice(startIndex, endIndex);
	}, [filteredAndSortedLogs, currentPage]);

	const totalPages = Math.ceil(filteredAndSortedLogs.length / PAGE_SIZE);

	// Reset page when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [filterEntidad, filterAccion, sortField, sortDirection]);

	const accionesUnicas = useMemo(() => {
		const acciones = new Set();
		logs.forEach((log) => {
			const attrs = log.attributes || log;
			if (attrs.Accion) {
				acciones.add(attrs.Accion);
			}
		});
		return ["Todas", ...Array.from(acciones)];
	}, [logs]);

	return (
		<Box p={6}>
			<ReportesHeader
				router={router}
				fetchLogs={fetchLogs}
				loading={loading}
				onOpenDelete={onOpen}
				logsLength={logs.length}
				deletingAll={deletingAll}
			/>

			<ReportesFilters
				filterEntidad={filterEntidad}
				setFilterEntidad={setFilterEntidad}
				filterAccion={filterAccion}
				setFilterAccion={setFilterAccion}
				accionesUnicas={accionesUnicas}
			/>

			{loading ? (
				<Flex justify="center" align="center" minH="200px">
					<Spinner size="xl" color="teal.500" />
				</Flex>
			) : filteredAndSortedLogs.length === 0 ? (
				<Box textAlign="center" py={10}>
					<Text fontSize="lg" color="gray.500">
						No hay actividades registradas
					</Text>
				</Box>
			) : (
				<>
					<ReportesTable
						paginatedLogs={paginatedLogs}
						sortField={sortField}
						sortDirection={sortDirection}
						handleSort={handleSort}
					/>

					<ReportesPagination
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						totalPages={totalPages}
						pageSize={PAGE_SIZE}
						totalCount={filteredAndSortedLogs.length}
					/>
				</>
			)}

			<DeleteAllDialog
				isOpen={isOpen}
				onClose={handleCloseDialog}
				cancelRef={cancelRef}
				logsLength={logs.length}
				deletingAll={deletingAll}
				handleDeleteAllLogs={handleDeleteAllLogs}
			/>
		</Box>
	);
}
