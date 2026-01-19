export const useFilteredClientes = (
	clientes,
	searchTerm,
	filterVip,
	filterZumbaBox,
	sortField,
	sortDirection
) => {
	let filtered = clientes;

	// Filter by search term
	if (searchTerm) {
		const search = searchTerm.toLowerCase();
		filtered = filtered.filter((cliente) => {
			const attrs = (cliente && (cliente.attributes ?? cliente)) || {};
			const fullName = `${attrs.Name ?? attrs.name ?? ""} ${
				attrs.LastName ?? attrs.lastName ?? ""
			}`.toLowerCase();
			const phone = (attrs.Phone ?? attrs.phone ?? "").toLowerCase();
			const email = (attrs.Email ?? attrs.email ?? "").toLowerCase();

			return (
				fullName.includes(search) ||
				phone.includes(search) ||
				email.includes(search)
			);
		});
	}

	// Filter by VIP status
	if (filterVip !== "all") {
		filtered = filtered.filter((cliente) => {
			const attrs = (cliente && (cliente.attributes ?? cliente)) || {};
			const isVip = !!(attrs.Vip ?? attrs.vip);
			return filterVip === "vip" ? isVip : !isVip;
		});
	}

	// Filter by Zumba/Box status
	if (filterZumbaBox !== "all") {
		filtered = filtered.filter((cliente) => {
			const attrs = (cliente && (cliente.attributes ?? cliente)) || {};
			const hasZumba = !!(attrs.Zumba ?? attrs.zumba);
			const hasBox = !!(attrs.Box ?? attrs.box);

			if (filterZumbaBox === "ambos") {
				return hasZumba && hasBox;
			} else if (filterZumbaBox === "zumba") {
				return hasZumba && !hasBox;
			} else if (filterZumbaBox === "box") {
				return hasBox && !hasZumba;
			} else if (filterZumbaBox === "no") {
				return !hasZumba && !hasBox;
			}
			return true;
		});
	}

	// Sort
	const sorted = [...filtered].sort((a, b) => {
		const aAttrs = (a && (a.attributes ?? a)) || {};
		const bAttrs = (b && (b.attributes ?? b)) || {};

		let aVal = "";
		let bVal = "";

		if (sortField === "Name") {
			aVal = (aAttrs.Name ?? aAttrs.name ?? "").toLowerCase();
			bVal = (bAttrs.Name ?? bAttrs.name ?? "").toLowerCase();
		} else if (sortField === "LastName") {
			aVal = (aAttrs.LastName ?? aAttrs.lastName ?? "").toLowerCase();
			bVal = (bAttrs.LastName ?? bAttrs.lastName ?? "").toLowerCase();
		} else if (sortField === "Phone") {
			aVal = (aAttrs.Phone ?? aAttrs.phone ?? "").toLowerCase();
			bVal = (bAttrs.Phone ?? bAttrs.phone ?? "").toLowerCase();
		} else if (sortField === "Email") {
			aVal = (aAttrs.Email ?? aAttrs.email ?? "").toLowerCase();
			bVal = (bAttrs.Email ?? bAttrs.email ?? "").toLowerCase();
		} else if (sortField === "createdAt") {
			aVal = a.createdAt || a.attributes?.createdAt || "";
			bVal = b.createdAt || b.attributes?.createdAt || "";
		}

		if (sortDirection === "asc") {
			return aVal.localeCompare(bVal);
		} else {
			return bVal.localeCompare(aVal);
		}
	});

	return sorted;
};
