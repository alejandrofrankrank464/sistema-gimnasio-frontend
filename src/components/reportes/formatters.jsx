import { Text } from "@chakra-ui/react";

export const formatDate = (dateString) => {
	if (!dateString) return "-";
	const date = new Date(dateString);
	return date.toLocaleString("es-ES", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
};

export const formatNombre = (nombreCompleto, detalles, accion) => {
	if (!nombreCompleto) return "-";

	// Si es una edición de cliente y cambió el nombre o apellido, mostrar anterior
	if (
		accion === "editar_cliente" &&
		detalles?.cambios &&
		detalles?.datosAnteriores
	) {
		const cambioNombre = detalles.cambios.Name !== undefined;
		const cambioApellido = detalles.cambios.LastName !== undefined;

		if (cambioNombre || cambioApellido) {
			const nombreAnterior = `${detalles.datosAnteriores.nombre || ""} ${
				detalles.datosAnteriores.apellido || ""
			}`.trim();

			// Solo mostrar tachado si el nombre realmente es diferente
			if (nombreAnterior !== nombreCompleto) {
				return (
					<>
						<Text
							as="span"
							textDecoration="line-through"
							color="gray.500"
							fontSize="xs"
						>
							{nombreAnterior}
						</Text>
						<br />
						<Text as="span" fontWeight="medium">
							{nombreCompleto}
						</Text>
					</>
				);
			}
		}
	}

	return nombreCompleto;
};

export const formatDetalles = (detalles, accion) => {
	if (!detalles) return "-";

	// Para acciones de editar, mostrar cambios en formato: Campo: anterior → nuevo
	if (accion?.includes("editar")) {
		// Verificar si detalles tiene el nuevo formato { campo: { anterior, nuevo } }
		const cambios = [];

		for (const [campo, valor] of Object.entries(detalles)) {
			// Si tiene estructura { anterior, nuevo }
			if (
				valor &&
				typeof valor === "object" &&
				("anterior" in valor || "nuevo" in valor)
			) {
				const anterior =
					valor.anterior !== undefined &&
					valor.anterior !== null &&
					valor.anterior !== ""
						? valor.anterior
						: "vacío";
				const nuevo =
					valor.nuevo !== undefined &&
					valor.nuevo !== null &&
					valor.nuevo !== ""
						? valor.nuevo
						: "vacío";

				cambios.push(`${campo}: ${anterior} → ${nuevo}`);
			}
		}

		if (cambios.length > 0) {
			return cambios.join(" | ");
		}

		// Fallback: formato antiguo con detalles.cambios
		if (detalles.cambios) {
			const camposModificados = Object.keys(detalles.cambios)
				.filter(
					(key) =>
						key !== "publishedAt" &&
						key !== "createdAt" &&
						key !== "updatedAt" &&
						key !== "cliente"
				)
				.map((key) => {
					const nombresCampos = {
						Name: "Nombre",
						LastName: "Apellido",
						Phone: "Teléfono",
						Email: "Email",
						Vip: "VIP",
						Zumba: "Zumba",
						Box: "Box",
						Turno: "Turno",
						MetodoPago: "Método de Pago",
						Monto: "Monto",
						TipoServicio: "Tipo de Servicio",
						MesPago: "Mes de Pago",
						AnioPago: "Año de Pago",
					};
					return nombresCampos[key] || key;
				});

			if (camposModificados.length > 0) {
				return `Modificó: ${camposModificados.join(", ")}`;
			}
		}

		return "-";
	}

	// Para crear/eliminar, mostrar info relevante (sin timestamps)
	if (accion?.includes("crear") || accion?.includes("eliminar")) {
		const info = [];

		// Para clientes
		if (accion?.includes("cliente")) {
			if (detalles.telefono) info.push(`Tel: ${detalles.telefono}`);
			if (detalles.email) info.push(`Email: ${detalles.email}`);
			if (detalles.vip) info.push("VIP");
			if (detalles.zumba) info.push("Zumba");
			if (detalles.box) info.push("Box");
			if (detalles.turno) info.push(`Turno: ${detalles.turno}`);
			if (detalles.metodoPago) info.push(detalles.metodoPago);
		}

		// Para pagos
		if (accion?.includes("pago")) {
			if (detalles.monto) info.push(`$${detalles.monto}`);
			if (detalles.tipoServicio) info.push(detalles.tipoServicio);
			if (detalles.mesPago !== undefined && detalles.anioPago) {
				const meses = [
					"Ene",
					"Feb",
					"Mar",
					"Abr",
					"May",
					"Jun",
					"Jul",
					"Ago",
					"Sep",
					"Oct",
					"Nov",
					"Dic",
				];
				info.push(`${meses[detalles.mesPago]} ${detalles.anioPago}`);
			}
			if (detalles.metodoPago) info.push(detalles.metodoPago);
		}

		return info.join(" | ") || "-";
	}

	// Fallback: mostrar JSON truncado
	return JSON.stringify(detalles).substring(0, 80) + "...";
};
