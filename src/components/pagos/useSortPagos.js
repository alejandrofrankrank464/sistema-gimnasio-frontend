export const useSortPagos = (pagos, sortField, sortDirection) => {
	return [...pagos].sort((a, b) => {
		const aAttrs = a.attributes || a;
		const bAttrs = b.attributes || b;

		let aVal, bVal;

		switch (sortField) {
			case "Cliente":
				const aCliente = aAttrs.cliente || {};
				const bCliente = bAttrs.cliente || {};
				aVal = `${aCliente.Name || ""} ${
					aCliente.LastName || ""
				}`.toLowerCase();
				bVal = `${bCliente.Name || ""} ${
					bCliente.LastName || ""
				}`.toLowerCase();
				break;
			case "Telefono":
				aVal = (aAttrs.cliente?.Phone || "").toLowerCase();
				bVal = (bAttrs.cliente?.Phone || "").toLowerCase();
				break;
			case "Monto":
				aVal = parseFloat(aAttrs.Monto) || 0;
				bVal = parseFloat(bAttrs.Monto) || 0;
				break;
			case "Metodo":
				aVal = (aAttrs.MetodoPago || "").toLowerCase();
				bVal = (bAttrs.MetodoPago || "").toLowerCase();
				break;
			case "TipoServicio":
				aVal = (aAttrs.TipoServicio || "").toLowerCase();
				bVal = (bAttrs.TipoServicio || "").toLowerCase();
				break;
			case "FechaPago":
				aVal = aAttrs.FechaPago || "";
				bVal = bAttrs.FechaPago || "";
				break;
			default:
				return 0;
		}

		if (typeof aVal === "string") {
			return sortDirection === "asc"
				? aVal.localeCompare(bVal)
				: bVal.localeCompare(aVal);
		} else {
			return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
		}
	});
};
