import { SunIcon, MoonIcon } from "@chakra-ui/icons";

export const formatDate = (dateString) => {
	if (!dateString) return "-";

	// Handle YYYY-MM-DD format first (FechaPago from backend)
	if (
		typeof dateString === "string" &&
		/^\d{4}-\d{2}-\d{2}$/.test(dateString)
	) {
		const [year, month, day] = dateString.split("-");
		return `${day}/${month}/${year}`;
	}

	// Handle ISO dates (from createdAt) - use UTC to avoid timezone issues
	const date = new Date(dateString);
	if (!isNaN(date.getTime())) {
		const day = String(date.getUTCDate()).padStart(2, "0");
		const month = String(date.getUTCMonth() + 1).padStart(2, "0");
		const year = date.getUTCFullYear();
		return `${day}/${month}/${year}`;
	}

	return "-";
};

export const formatMesPago = (mesPago, anioPago) => {
	if (mesPago === undefined || mesPago === null || !anioPago) return "-";
	const meses = [
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Junio",
		"Julio",
		"Agosto",
		"Septiembre",
		"Octubre",
		"Noviembre",
		"Diciembre",
	];
	return `${meses[mesPago]} ${anioPago}`;
};

export const formatMonto = (monto) => {
	return new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "USD",
	}).format(monto || 0);
};

export const formatTurno = (turnoString) => {
	if (!turnoString) return null;
	const match = turnoString.match(
		/de\s+(\d+:\d+)\s+[ap]m\s+a\s+(\d+:\d+)\s+[ap]m/
	);
	if (match) {
		return `${match[1]}-${match[2]}`;
	}
	return turnoString;
};

export const getTurnoIcon = (turnoString) => {
	if (!turnoString) return null;
	const isAM = turnoString.toLowerCase().includes("am");
	return isAM ? (
		<SunIcon mr={1} boxSize={3} />
	) : (
		<MoonIcon mr={1} boxSize={3} />
	);
};
