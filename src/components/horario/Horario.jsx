"use client";

import { Box, Container, VStack, Flex, Spinner } from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import HorarioHeader from "./HorarioHeader";
import WeekNavigation from "./WeekNavigation";
import HorarioTable from "./HorarioTable";
import HorarioLegend from "./HorarioLegend";

export default function Horario() {
	const [clientes, setClientes] = useState([]);
	const [pagos, setPagos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentWeekStart, setCurrentWeekStart] = useState(() => {
		const today = new Date();
		const day = today.getDay();
		const diff = day === 0 ? -6 : 1 - day;
		const monday = new Date(today);
		monday.setDate(today.getDate() + diff);
		monday.setHours(0, 0, 0, 0);
		return monday;
	});

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const token = sessionStorage.getItem("token");

			// Obtener clientes
			const clientesRes = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/clientes?populate=*`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			const clientesData = await clientesRes.json();
			setClientes(clientesData.data || []);

			// Obtener pagos
			const pagosRes = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/pagos?populate=cliente`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			const pagosData = await pagosRes.json();
			setPagos(pagosData.data || []);
		} catch (error) {
			console.error("Error al cargar datos:", error);
		} finally {
			setLoading(false);
		}
	};

	// Verificar si un cliente tiene pago activo y obtener el pago
	// referenceDate: fecha de la semana que se está visualizando
	const getPagoActivo = (clienteId, referenceDate) => {
		const refMonth = referenceDate.getMonth(); // 0-11
		const refYear = referenceDate.getFullYear();
		const refDay = referenceDate.getDate();

		// Buscar pago del mes de referencia
		const pagoMesActual = pagos.find((pago) => {
			const pagoClienteId = pago.cliente?.id || pago.cliente;
			if (pagoClienteId !== clienteId) return false;

			return pago.MesPago === refMonth && pago.AnioPago === refYear;
		});

		// Si hay pago del mes actual, retornarlo
		if (pagoMesActual) return pagoMesActual;

		// Si estamos en los primeros 10 días del mes, buscar pago del mes anterior
		if (refDay <= 10) {
			const prevMonth = refMonth === 0 ? 11 : refMonth - 1;
			const prevYear = refMonth === 0 ? refYear - 1 : refYear;

			const pagoMesAnterior = pagos.find((pago) => {
				const pagoClienteId = pago.cliente?.id || pago.cliente;
				if (pagoClienteId !== clienteId) return false;

				return pago.MesPago === prevMonth && pago.AnioPago === prevYear;
			});

			if (pagoMesAnterior) return pagoMesAnterior;
		}

		// No hay pago válido
		return null;
	};

	// Obtener clientes activos filtrados por día
	const getClientesForDay = (dayIndex, hour) => {
		const isSaturday = dayIndex === 5;
		const dayDate = weekDays[dayIndex]; // Fecha del día que se está visualizando

		const clientesActivos = [];

		clientes.forEach((cliente) => {
			const clienteId = cliente.id;

			// Obtener pago activo para la fecha del día visualizado
			const pagoActivo = getPagoActivo(clienteId, dayDate);
			if (!pagoActivo) return;

			// Sábado: Solo Zumba/Box
			if (isSaturday) {
				const tipoServicio = pagoActivo.TipoServicio;
				const isZumbaBox =
					tipoServicio === "Zumba" ||
					tipoServicio === "Box" ||
					tipoServicio === "Zumba y Box" ||
					tipoServicio === "VIP + Zumba y Box" ||
					tipoServicio === "Zumba o Box";

				if (isZumbaBox) {
					clientesActivos.push(cliente);
				}
				return;
			}

			// Lun-Vie: Parsear el turno para extraer la hora de inicio
			// Formato: "de 8:00 am a 9:00 am" o "de 1:00 pm a 2:00 pm"
			const turno = pagoActivo.Turno;
			if (!turno) return;

			// Extraer hora de inicio usando regex
			const match = turno.match(/de (\d+):00 (am|pm)/);
			if (!match) return;

			let horaInicio = parseInt(match[1]);
			const periodo = match[2];

			// Convertir a formato 24 horas
			if (periodo === "pm" && horaInicio !== 12) {
				horaInicio += 12;
			} else if (periodo === "am" && horaInicio === 12) {
				horaInicio = 0;
			}

			// Mostrar cliente en su hora específica
			if (hour === horaInicio) {
				clientesActivos.push(cliente);
			}
		});

		return clientesActivos;
	};

	// Obtener clientes VIP que pueden ir a cualquier hora
	const getClientesVIPTodoElDia = (dayIndex) => {
		const isSaturday = dayIndex === 5;
		if (isSaturday) return []; // Los sábados solo Zumba/Box

		const dayDate = weekDays[dayIndex]; // Fecha del día que se está visualizando
		const clientesVIP = [];

		clientes.forEach((cliente) => {
			const clienteId = cliente.id;

			// Obtener pago activo para la fecha del día visualizado
			const pagoActivo = getPagoActivo(clienteId, dayDate);
			if (!pagoActivo) return;

			const tipoServicio = pagoActivo.TipoServicio;

			// VIP, Normal, o VIP + Zumba y Box (pueden ir a cualquier hora)
			if (
				tipoServicio === "VIP" ||
				tipoServicio === "Normal" ||
				tipoServicio === "VIP + Zumba y Box"
			) {
				clientesVIP.push(cliente);
			}
		});

		return clientesVIP;
	};

	const weekDays = useMemo(() => {
		const days = [];
		for (let i = 0; i < 6; i++) {
			const date = new Date(currentWeekStart);
			date.setDate(currentWeekStart.getDate() + i);
			days.push(date);
		}
		return days;
	}, [currentWeekStart]);

	const hours = [7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20];

	const goToPreviousWeek = () => {
		const newDate = new Date(currentWeekStart);
		newDate.setDate(newDate.getDate() - 7);
		setCurrentWeekStart(newDate);
	};

	const goToNextWeek = () => {
		const newDate = new Date(currentWeekStart);
		newDate.setDate(newDate.getDate() + 7);
		setCurrentWeekStart(newDate);
	};

	const goToCurrentWeek = () => {
		const today = new Date();
		const day = today.getDay();
		const diff = day === 0 ? -6 : 1 - day;
		const monday = new Date(today);
		monday.setDate(today.getDate() + diff);
		monday.setHours(0, 0, 0, 0);
		setCurrentWeekStart(monday);
	};

	if (loading) {
		return (
			<Box minH="100vh" bg="gray.50" py={6}>
				<Container maxW="1400px">
					<Flex justify="center" align="center" minH="400px">
						<Spinner size="xl" color="teal.500" />
					</Flex>
				</Container>
			</Box>
		);
	}

	return (
		<Box minH="100vh" bg="gray.50" py={6}>
			<Container maxW="1400px">
				<VStack spacing={6} align="stretch">
					<HorarioHeader />

					<WeekNavigation
						weekDays={weekDays}
						onPrevious={goToPreviousWeek}
						onNext={goToNextWeek}
						onCurrentWeek={goToCurrentWeek}
					/>

					<HorarioTable
						weekDays={weekDays}
						hours={hours}
						getClientesForDay={getClientesForDay}
						getClientesVIPTodoElDia={getClientesVIPTodoElDia}
						getPagoActivo={getPagoActivo}
					/>

					<HorarioLegend />
				</VStack>
			</Container>
		</Box>
	);
}
