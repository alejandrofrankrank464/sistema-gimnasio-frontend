"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
	Box,
	useToast,
	Spinner,
	Text,
	Flex,
	useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import PagosForm from "./PagosForm";
import EditPagoDrawer from "./EditPagoDrawer";
import PagosHeader from "./PagosHeader";
import PagosFilters from "./PagosFilters";
import PagosTable from "./PagosTable";
import { MONTHS, EMPTY_EDIT_VALUES } from "./constants";
import { useSortPagos } from "./useSortPagos";

export default function PagosView() {
	const router = useRouter();
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth();

	const [selectedYear, setSelectedYear] = useState(currentYear);
	const [selectedMonth, setSelectedMonth] = useState(currentMonth);
	const [pagos, setPagos] = useState([]);
	const [clientes, setClientes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [sortField, setSortField] = useState("FechaPago");
	const [sortDirection, setSortDirection] = useState("desc");
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	// Edit states
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [editingPago, setEditingPago] = useState(null);
	const [editValues, setEditValues] = useState(EMPTY_EDIT_VALUES);
	const [originalEditValues, setOriginalEditValues] =
		useState(EMPTY_EDIT_VALUES);
	const [editSaving, setEditSaving] = useState(false);

	// Check if edit values changed
	const editDirty = useMemo(() => {
		const metodoPagoChanged =
			editValues.MetodoPago !== originalEditValues.MetodoPago;
		const tipoServicioChanged =
			editValues.TipoServicio !== originalEditValues.TipoServicio;

		// Para servicios VIP, ignorar el turno en la comparación
		const isVipService =
			editValues.TipoServicio === "VIP" ||
			editValues.TipoServicio === "VIP + Zumba y Box";
		const turnoChanged = isVipService
			? false
			: (editValues.Turno || "") !== (originalEditValues.Turno || "");

		return metodoPagoChanged || tipoServicioChanged || turnoChanged;
	}, [editValues, originalEditValues]);

	// Generate years (current - 2 to current + 1)
	const years = Array.from({ length: 4 }, (_, i) => currentYear - 2 + i);

	const fetchPagos = useCallback(async () => {
		setLoading(true);
		try {
			const token = sessionStorage.getItem("token");

			const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/pagos`);
			url.searchParams.set("populate", "*");
			url.searchParams.set("pagination[pageSize]", "1000");
			url.searchParams.set("sort", "FechaPago:desc");

			const res = await fetch(url.toString(), {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (!res.ok) throw new Error("Error al cargar pagos");
			const data = await res.json();

			// Filter by selected month and year on client side
			const filtered = (data.data || []).filter((pago) => {
				const attrs = pago.attributes || pago;

				// Use MesPago and AnioPago for filtering the period
				return (
					attrs.AnioPago === selectedYear &&
					attrs.MesPago === selectedMonth
				);
			});

			setPagos(filtered);
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
	}, [selectedYear, selectedMonth, toast]);

	const fetchClientes = useCallback(async () => {
		try {
			const token = sessionStorage.getItem("token");
			const url = new URL(
				`${process.env.NEXT_PUBLIC_API_URL}/api/clientes`
			);
			url.searchParams.set("pagination[pageSize]", "1000");
			url.searchParams.set("sort", "Name:asc");

			const res = await fetch(url.toString(), {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (!res.ok) throw new Error("Error al cargar clientes");
			const data = await res.json();
			setClientes(data.data || []);
		} catch (error) {
			console.error("Error fetching clientes:", error);
		}
	}, []);

	useEffect(() => {
		fetchPagos();
		fetchClientes();
	}, [fetchPagos, fetchClientes]);

	const handleSort = (field) => {
		if (sortField === field) {
			setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const sortedPagos = useSortPagos(pagos, sortField, sortDirection);

	const handleDelete = async (pago) => {
		if (!confirm("¿Estás seguro de eliminar este pago?")) {
			// Asegurarse de que no queden estados inconsistentes al cancelar
			setEditSaving(false);
			return;
		}

		try {
			const token = sessionStorage.getItem("token");
			const username = sessionStorage.getItem("username") || "Sistema";
			const idOrDoc = pago.documentId ?? pago.id;
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/pagos/${idOrDoc}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ username: username }),
				}
			);

			if (!res.ok) throw new Error("Error al eliminar pago");

			toast({
				title: "Pago eliminado",
				status: "success",
				duration: 3000,
				isClosable: true,
			});

			fetchPagos();
		} catch (error) {
			toast({
				title: "Error",
				description: error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const handleEdit = (pago) => {
		const attrs = pago.attributes || pago;
		setEditingPago(pago);
		const values = {
			MetodoPago: attrs.MetodoPago || "Efectivo",
			TipoServicio: attrs.TipoServicio || "Normal",
			Turno: attrs.Turno || "",
		};
		setEditValues(values);
		setOriginalEditValues(values);
		setIsEditOpen(true);
	};

	const closeEdit = () => {
		setIsEditOpen(false);
	};

	const handleEditClosed = () => {
		setEditingPago(null);
		setEditValues(EMPTY_EDIT_VALUES);
		setOriginalEditValues(EMPTY_EDIT_VALUES);
		setEditSaving(false);
	};

	const handleEditSave = async () => {
		if (!editingPago || editSaving || !editDirty) return;

		const requiresTurno =
			editValues.TipoServicio !== "VIP" &&
			editValues.TipoServicio !== "VIP + Zumba y Box";
		if (requiresTurno && !editValues.Turno) {
			toast({
				title: "Turno requerido",
				description: "Debes seleccionar un turno para servicios no VIP",
				status: "warning",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		setEditSaving(true);
		setIsEditOpen(false);

		try {
			const token = sessionStorage.getItem("token");
			const username = sessionStorage.getItem("username") || "Sistema";
			const idOrDoc = editingPago.documentId ?? editingPago.id;

			// Detectar cambios comparando con originalEditValues
			const cambios = {};

			if (editValues.MetodoPago !== originalEditValues.MetodoPago) {
				cambios["Método de Pago"] = {
					anterior: originalEditValues.MetodoPago,
					nuevo: editValues.MetodoPago,
				};
			}
			if (editValues.TipoServicio !== originalEditValues.TipoServicio) {
				cambios["Tipo de Servicio"] = {
					anterior: originalEditValues.TipoServicio,
					nuevo: editValues.TipoServicio,
				};
			}
			const newTurno =
				editValues.TipoServicio === "VIP" ? null : editValues.Turno;
			const oldTurno =
				originalEditValues.TipoServicio === "VIP"
					? null
					: originalEditValues.Turno;
			if (newTurno !== oldTurno) {
				cambios.Turno = {
					anterior: oldTurno || "Sin turno",
					nuevo: newTurno || "Sin turno",
				};
			}

			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/pagos/${idOrDoc}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						username: username,
						cambios: cambios,
						data: {
							MetodoPago: editValues.MetodoPago,
							TipoServicio: editValues.TipoServicio,
							Turno: newTurno,
						},
					}),
				}
			);

			if (!res.ok) throw new Error("Error al actualizar pago");

			toast({
				title: "Pago actualizado",
				description: "Los cambios se guardaron correctamente",
				status: "success",
				duration: 3000,
				isClosable: true,
			});

			fetchPagos();
		} catch (error) {
			toast({
				title: "Error",
				description: error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setEditSaving(false);
		}
	};

	const totalMonto = pagos.reduce((sum, pago) => {
		const attrs = pago.attributes || pago;
		return sum + (parseFloat(attrs.Monto) || 0);
	}, 0);

	return (
		<Box p={6}>
			<PagosHeader router={router} onOpenCreate={onOpen} />

			<PagosForm
				isOpen={isOpen}
				onClose={onClose}
				onSuccess={fetchPagos}
			/>

			<EditPagoDrawer
				isOpen={isEditOpen}
				onClose={closeEdit}
				onClosed={handleEditClosed}
				values={editValues}
				setValues={setEditValues}
				onSave={handleEditSave}
				saving={editSaving}
				dirty={editDirty}
				clienteName={
					editingPago
						? (() => {
								const attrs =
									editingPago.attributes || editingPago;
								const clienteAttrs = attrs.cliente || {};
								return (
									`${clienteAttrs.Name || ""} ${
										clienteAttrs.LastName || ""
									}`.trim() || "Cliente"
								);
						  })()
						: ""
				}
			/>

			<PagosFilters
				selectedYear={selectedYear}
				setSelectedYear={setSelectedYear}
				selectedMonth={selectedMonth}
				setSelectedMonth={setSelectedMonth}
				years={years}
				totalMonto={totalMonto}
			/>

			{loading ? (
				<Flex justify="center" align="center" minH="200px">
					<Spinner size="xl" color="teal.500" />
				</Flex>
			) : pagos.length === 0 ? (
				<Box textAlign="center" py={10}>
					<Text fontSize="lg" color="gray.500">
						No hay pagos registrados para {MONTHS[selectedMonth]}{" "}
						{selectedYear}
					</Text>
				</Box>
			) : (
				<PagosTable
					sortedPagos={sortedPagos}
					sortField={sortField}
					sortDirection={sortDirection}
					handleSort={handleSort}
					handleEdit={handleEdit}
					handleDelete={handleDelete}
				/>
			)}
		</Box>
	);
}
