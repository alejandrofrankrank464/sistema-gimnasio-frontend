"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Box, useToast, Spinner, Text, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { validate as validateEmail } from "email-validator";

import ClientesTable from "@/components/clientes/ClientesTable";
import EditClienteModal from "@/components/clientes/EditClienteModal";
import ClientForm from "@/components/clientes/clientform";
import ClientesHeader from "@/components/clientes/ClientesHeader";
import ClientesFilters from "@/components/clientes/ClientesFilters";
import ClientesPagination from "@/components/clientes/ClientesPagination";
import { EMPTY_VALUES } from "@/components/clientes/constants";
import { useFilteredClientes } from "@/components/clientes/useFilteredClientes";

export default function ClientList() {
	const router = useRouter();
	const [clientes, setClientes] = useState([]);
	const [pagos, setPagos] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [loading, setLoading] = useState(true);
	const [totalCount, setTotalCount] = useState(0);
	const [sortField, setSortField] = useState("Name");
	const [sortDirection, setSortDirection] = useState("asc");
	const [filterVip, setFilterVip] = useState("all");
	const [filterZumbaBox, setFilterZumbaBox] = useState("all"); // "all", "ambos", "zumba", "box", "no"
	const toast = useToast();
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [editValues, setEditValues] = useState(EMPTY_VALUES);
	const [originalValues, setOriginalValues] = useState(EMPTY_VALUES);
	const [saving, setSaving] = useState(false);
	const [editErrors, setEditErrors] = useState({});

	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [createValues, setCreateValues] = useState(EMPTY_VALUES);
	const [createSaving, setCreateSaving] = useState(false);
	const [createErrors, setCreateErrors] = useState({});
	// dirty: true si hay cambios respecto a originalValues
	const dirty = useMemo(() => {
		const isDirty =
			editValues.Name !== originalValues.Name ||
			editValues.LastName !== originalValues.LastName ||
			editValues.Phone !== originalValues.Phone ||
			editValues.CountryCode !== originalValues.CountryCode ||
			(editValues.Email || "") !== (originalValues.Email || "") ||
			!!editValues.Vip !== !!originalValues.Vip ||
			!!editValues.Zumba !== !!originalValues.Zumba ||
			!!editValues.Box !== !!originalValues.Box;
		console.log("🔍 Dirty check:", { isDirty, editValues, originalValues });
		return isDirty;
	}, [editValues, originalValues]);

	const editingIdRef = useRef(null);
	const originalValuesRef = useRef(EMPTY_VALUES);

	const saveControllerRef = useRef(null);
	const saveTimeoutRef = useRef(null);
	const userAbortedRef = useRef(false);
	const saveInFlightRef = useRef(false);

	const fetchClientes = useCallback(async () => {
		setLoading(true);
		try {
			const token = sessionStorage.getItem("token");
			const url = new URL(
				`${process.env.NEXT_PUBLIC_API_URL}/api/clientes`
			);
			url.searchParams.set("pagination[page]", currentPage);
			url.searchParams.set("pagination[pageSize]", pageSize);
			url.searchParams.set("sort", "Name:asc");

			const res = await fetch(url.toString(), {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok) throw new Error("Error al cargar clientes");
			const data = await res.json();

			// Fetch all pagos for current month calculation
			const pagosRes = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/pagos?pagination[pageSize]=10000&populate=cliente`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (pagosRes.ok) {
				const pagosData = await pagosRes.json();
				console.log("🔍 Pagos cargados:", pagosData.data?.slice(0, 2)); // Ver primeros 2 pagos
				setPagos(pagosData.data || []);
			}

			setClientes(data.data || []);
			setTotalCount(data.meta?.pagination?.total || 0);
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
	}, [currentPage, pageSize, toast]);

	const handleSort = useCallback(
		(field) => {
			if (sortField === field) {
				setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
			} else {
				setSortField(field);
				setSortDirection("asc");
			}
		},
		[sortField]
	);

	const filteredClientes = useFilteredClientes(
		clientes,
		searchTerm,
		filterVip,
		filterZumbaBox,
		sortField,
		sortDirection
	);

	useEffect(() => {
		fetchClientes();
	}, [fetchClientes]);

	const handleDelete = useCallback(
		async (cliente) => {
			if (!confirm("¿Estás seguro de eliminar este cliente?")) return;

			try {
				const token = sessionStorage.getItem("token");
				const username =
					sessionStorage.getItem("username") || "Sistema";
				const idOrDoc = cliente.documentId ?? cliente.id;
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/clientes/${idOrDoc}`,
					{
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({ username: username }),
					}
				);

				if (!res.ok) throw new Error("Error al eliminar cliente");

				toast({
					title: "Cliente eliminado",
					status: "success",
					duration: 3000,
					isClosable: true,
				});

				fetchClientes();
			} catch (error) {
				toast({
					title: "Error",
					description: error.message,
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			}
		},
		[fetchClientes, toast]
	);

	const handleView = useCallback(
		(cliente) => {
			const id = cliente.documentId ?? cliente.id;
			router.push(`/clientes/${id}`);
		},
		[router]
	);

	const totalPages = useMemo(
		() => Math.ceil(totalCount / pageSize),
		[totalCount, pageSize]
	);

	const openEdit = useCallback((cliente) => {
		const a = (cliente && (cliente.attributes ?? cliente)) || {};
		const id = cliente.documentId ?? cliente.id;
		setEditingId(id);
		editingIdRef.current = id;

		// Parse phone number if it's in E.164 format
		let phoneNumber = a.Phone ?? a.phone ?? "";
		let countryCode = "+53";

		if (phoneNumber && phoneNumber.startsWith("+")) {
			try {
				const parsed = parsePhoneNumberFromString(phoneNumber);
				if (parsed) {
					countryCode = `+${parsed.countryCallingCode}`;
					phoneNumber = parsed.nationalNumber;
				}
			} catch (error) {
				console.warn("Error parsing phone number:", error);
			}
		}

		const filled = {
			Name: a.Name ?? a.name ?? "",
			LastName: a.LastName ?? a.lastName ?? "",
			Phone: phoneNumber,
			CountryCode: countryCode,
			Email: a.Email ?? a.email ?? "",
			Vip: a.Vip ?? a.vip ?? false,
			Zumba: a.Zumba ?? a.zumba ?? false,
			Box: a.Box ?? a.box ?? false,
		};
		setEditValues(filled);
		setOriginalValues(filled);
		originalValuesRef.current = filled;
		setEditErrors({});
		setIsEditOpen(true);
	}, []);

	const closeEdit = useCallback(() => {
		// Immediately close modal visually
		setIsEditOpen(false);
	}, []);

	const handleEditClosed = useCallback(() => {
		// Only abort if there's NO save in progress
		// If save is in progress, let it finish naturally
		if (!saveInFlightRef.current) {
			console.log("🧹 Cleaning up - no save in progress");
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
				saveTimeoutRef.current = null;
			}
			if (saveControllerRef.current) {
				userAbortedRef.current = true;
				try {
					saveControllerRef.current.abort();
				} catch {
					// ignore
				}
				saveControllerRef.current = null;
			}
		} else {
			console.log("💾 Save in progress - skipping abort");
		}

		// Reset all state after modal animation completes
		// But only if save is NOT in progress
		if (!saveInFlightRef.current) {
			setEditingId(null);
			editingIdRef.current = null;
			setEditValues({ ...EMPTY_VALUES });
			setOriginalValues({ ...EMPTY_VALUES });
			originalValuesRef.current = EMPTY_VALUES;
			setEditErrors({});
			setSaving(false);
		}
	}, []);

	const openCreate = useCallback(() => {
		setCreateValues({ ...EMPTY_VALUES });
		setCreateErrors({});
		setIsCreateOpen(true);
	}, []);

	const closeCreate = useCallback(() => {
		setIsCreateOpen(false);
	}, []);

	const handleCreateClosed = useCallback(() => {
		setCreateValues({ ...EMPTY_VALUES });
		setCreateErrors({});
		setCreateSaving(false);
	}, []);

	const handleCreateSave = async () => {
		if (createSaving) return;

		const payload = { ...(createValues ?? EMPTY_VALUES) };

		// Validate required fields
		if (
			!payload.Name?.trim() ||
			!payload.LastName?.trim() ||
			!payload.Phone?.trim()
		) {
			toast({
				title: "Campos requeridos",
				description: "Nombre, Apellido y Teléfono son obligatorios",
				status: "warning",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		// Validate name format: Unicode letters, spaces, hyphens, apostrophes only
		const nameRegex = /^[\p{L}\s''’-]+$/u;
		if (!nameRegex.test(payload.Name.trim())) {
			setCreateErrors({
				Name: "El nombre solo puede contener letras, espacios, guiones y apóstrofes",
			});
			toast({
				title: "Nombre inválido",
				description:
					"El nombre solo puede contener letras, espacios, guiones y apóstrofes",
				status: "warning",
				duration: 3000,
				isClosable: true,
			});
			return;
		}
		if (payload.Name.trim().length < 2 || payload.Name.trim().length > 50) {
			setCreateErrors({
				Name: "El nombre debe tener entre 2 y 50 caracteres",
			});
			toast({
				title: "Nombre inválido",
				description: "El nombre debe tener entre 2 y 50 caracteres",
				status: "warning",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		// Validate last name format
		if (!nameRegex.test(payload.LastName.trim())) {
			setCreateErrors({
				LastName:
					"El apellido solo puede contener letras, espacios, guiones y apóstrofes",
			});
			toast({
				title: "Apellido inválido",
				description:
					"El apellido solo puede contener letras, espacios, guiones y apóstrofes",
				status: "warning",
				duration: 3000,
				isClosable: true,
			});
			return;
		}
		if (
			payload.LastName.trim().length < 2 ||
			payload.LastName.trim().length > 50
		) {
			setCreateErrors({
				LastName: "El apellido debe tener entre 2 y 50 caracteres",
			});
			toast({
				title: "Apellido inválido",
				description: "El apellido debe tener entre 2 y 50 caracteres",
				status: "warning",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		// Validate email format if provided
		if (payload.Email?.trim()) {
			if (!validateEmail(payload.Email.trim())) {
				setCreateErrors({ Email: "Por favor ingresa un email válido" });
				toast({
					title: "Email inválido",
					description: "Por favor ingresa un email válido",
					status: "warning",
					duration: 3000,
					isClosable: true,
				});
				return;
			}
		}

		// Validate phone number with libphonenumber-js
		let formattedPhone = payload.Phone;
		if (payload.Phone?.trim()) {
			try {
				const fullPhone = `${
					payload.CountryCode
				}${payload.Phone.replace(/\s/g, "")}`;
				const phoneNumber = parsePhoneNumberFromString(fullPhone);

				if (!phoneNumber || !phoneNumber.isValid()) {
					setCreateErrors({
						Phone: "Por favor ingresa un número de teléfono válido",
					});
					toast({
						title: "Teléfono inválido",
						description: "Por favor verifica el número de teléfono",
						status: "warning",
						duration: 3000,
						isClosable: true,
					});
					return;
				}
				// Format to E.164
				formattedPhone = phoneNumber.format("E.164");
			} catch (error) {
				setCreateErrors({
					Phone: "Por favor ingresa un número de teléfono válido",
				});
				toast({
					title: "Teléfono inválido",
					description: "Por favor verifica el número de teléfono",
					status: "warning",
					duration: 3000,
					isClosable: true,
				});
				return;
			}
		}

		// Clear previous errors and close modal immediately
		setCreateErrors({});
		setCreateSaving(true);
		setIsCreateOpen(false);

		try {
			const token = sessionStorage.getItem("token");
			const username = sessionStorage.getItem("username") || "Sistema";
			if (!token)
				throw new Error("Sesión expirada. Vuelve a iniciar sesión.");

			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/clientes`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						username: username,
						data: {
							Name: payload.Name,
							LastName: payload.LastName,
							Phone: formattedPhone,
							Email: payload.Email || null,
							Vip: !!payload.Vip,
							Zumba: !!payload.Zumba,
							Box: !!payload.Box,
							Turno: payload.Vip
								? null
								: payload.Turno && payload.Turno.trim() !== ""
								? payload.Turno
								: null,
							MetodoPago: payload.MetodoPago || "Efectivo",
						},
					}),
				}
			);

			if (!res.ok) {
				// Parse error from server
				const fieldErrors = {};

				try {
					const errorData = await res.json();
					console.log("Server error:", errorData); // Debug

					if (errorData?.error) {
						const msg = (
							errorData.error.message || ""
						).toLowerCase();
						const details = errorData.error.details?.errors || [];

						// Check error details array (Strapi validation errors)
						details.forEach((err) => {
							const path = err.path?.[0] || "";
							const errMsg = (err.message || "").toLowerCase();

							if (
								path === "Phone" ||
								errMsg.includes("phone") ||
								errMsg.includes("teléfono")
							) {
								fieldErrors.Phone =
									"Este número de teléfono ya está registrado";
							}
							if (
								path === "Email" ||
								errMsg.includes("email") ||
								errMsg.includes("correo")
							) {
								// Check if it's a validation error (invalid format) or duplicate
								if (
									errMsg.includes("valid") ||
									errMsg.includes("invalid") ||
									errMsg.includes("format")
								) {
									fieldErrors.Email =
										"Por favor ingresa un email válido";
								} else {
									fieldErrors.Email =
										"Este email ya está registrado";
								}
							}
						});

						// Also check main error message
						if (msg.includes("phone") || msg.includes("teléfono")) {
							fieldErrors.Phone =
								"Este número de teléfono ya está registrado";
						} else if (
							msg.includes("email") ||
							msg.includes("correo")
						) {
							// Distinguish between validation and duplicate errors
							if (
								msg.includes("valid") ||
								msg.includes("invalid") ||
								msg.includes("format")
							) {
								fieldErrors.Email =
									"Por favor ingresa un email válido";
							} else if (
								msg.includes("unique") ||
								msg.includes("duplicate") ||
								msg.includes("already")
							) {
								fieldErrors.Email =
									"Este email ya está registrado";
							} else {
								// Generic email error - assume validation issue
								fieldErrors.Email =
									"Por favor ingresa un email válido";
							}
						} else if (
							msg.includes("unique") ||
							msg.includes("duplicate") ||
							msg.includes("already exists")
						) {
							// Generic unique constraint error - try to detect field
							if (msg.includes("phone") || msg.includes("tel")) {
								fieldErrors.Phone =
									"Este número de teléfono ya está registrado";
							} else if (
								msg.includes("email") ||
								msg.includes("mail")
							) {
								fieldErrors.Email =
									"Este email ya está registrado";
							}
						}
					}
				} catch (parseError) {
					console.error("Error parsing server response:", parseError);
				}

				console.log("Field errors detected:", fieldErrors); // Debug

				// If there are field errors, reopen modal to show them
				if (Object.keys(fieldErrors).length > 0) {
					setCreateErrors(fieldErrors);
					setIsCreateOpen(true);
				}

				throw new Error("Error al procesar la solicitud");
			}

			toast({
				title: "Cliente registrado",
				description:
					"El cliente se registró correctamente con su pago inicial",
				status: "success",
				duration: 3000,
				isClosable: true,
			});

			fetchClientes();
		} catch (error) {
			toast({
				title: "Error",
				description: error?.message || "Error inesperado",
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		} finally {
			setCreateSaving(false);
		}
	};

	const handleEditSave = async () => {
		const id = editingIdRef.current;

		console.log("💾 handleEditSave called:", {
			id,
			saving,
			saveInFlight: saveInFlightRef.current,
			dirty,
			editValues,
			originalValues,
		});

		if (!id) {
			console.error("❌ No ID found");
			return;
		}

		if (saving || saveInFlightRef.current) {
			console.warn("⏳ Save already in progress");
			return;
		}

		if (!dirty) {
			console.warn("⚠️ No changes detected");
			toast({
				title: "Sin cambios",
				description: "No hay cambios para guardar",
				status: "info",
				duration: 2000,
				isClosable: true,
			});
			setIsEditOpen(false);
			return;
		}

		// Snapshot values before validating
		const payload = { ...(editValues ?? EMPTY_VALUES) };

		// Validate name format: Unicode letters, spaces, hyphens, apostrophes only
		const nameRegex = /^[\p{L}\s''’-]+$/u;
		if (payload.Name?.trim()) {
			if (!nameRegex.test(payload.Name.trim())) {
				setEditErrors({
					Name: "El nombre solo puede contener letras, espacios, guiones y apóstrofes",
				});
				toast({
					title: "Nombre inválido",
					description:
						"El nombre solo puede contener letras, espacios, guiones y apóstrofes",
					status: "warning",
					duration: 3000,
					isClosable: true,
				});
				return;
			}
			if (
				payload.Name.trim().length < 2 ||
				payload.Name.trim().length > 50
			) {
				setEditErrors({
					Name: "El nombre debe tener entre 2 y 50 caracteres",
				});
				toast({
					title: "Nombre inválido",
					description: "El nombre debe tener entre 2 y 50 caracteres",
					status: "warning",
					duration: 3000,
					isClosable: true,
				});
				return;
			}
		}

		// Validate last name format
		if (payload.LastName?.trim()) {
			if (!nameRegex.test(payload.LastName.trim())) {
				setEditErrors({
					LastName:
						"El apellido solo puede contener letras, espacios, guiones y apóstrofes",
				});
				toast({
					title: "Apellido inválido",
					description:
						"El apellido solo puede contener letras, espacios, guiones y apóstrofes",
					status: "warning",
					duration: 3000,
					isClosable: true,
				});
				return;
			}
			if (
				payload.LastName.trim().length < 2 ||
				payload.LastName.trim().length > 50
			) {
				setEditErrors({
					LastName: "El apellido debe tener entre 2 y 50 caracteres",
				});
				toast({
					title: "Apellido inválido",
					description:
						"El apellido debe tener entre 2 y 50 caracteres",
					status: "warning",
					duration: 3000,
					isClosable: true,
				});
				return;
			}
		}

		// Validate email format if provided
		if (payload.Email?.trim()) {
			if (!validateEmail(payload.Email.trim())) {
				setEditErrors({ Email: "Por favor ingresa un email válido" });
				toast({
					title: "Email inválido",
					description: "Por favor ingresa un email válido",
					status: "warning",
					duration: 3000,
					isClosable: true,
				});
				return;
			}
		}

		// Validate phone number with libphonenumber-js
		let formattedPhone = payload.Phone;
		if (payload.Phone?.trim()) {
			try {
				const fullPhone = `${
					payload.CountryCode
				}${payload.Phone.replace(/\s/g, "")}`;
				const phoneNumber = parsePhoneNumberFromString(fullPhone);

				if (!phoneNumber || !phoneNumber.isValid()) {
					setEditErrors({
						Phone: "Por favor ingresa un número de teléfono válido",
					});
					toast({
						title: "Teléfono inválido",
						description: "Por favor verifica el número de teléfono",
						status: "warning",
						duration: 3000,
						isClosable: true,
					});
					return;
				}
				// Format to E.164
				formattedPhone = phoneNumber.format("E.164");
			} catch (error) {
				setEditErrors({
					Phone: "Por favor ingresa un número de teléfono válido",
				});
				toast({
					title: "Teléfono inválido",
					description: "Por favor verifica el número de teléfono",
					status: "warning",
					duration: 3000,
					isClosable: true,
				});
				return;
			}
		}

		console.log("📦 Payload to save:", payload);

		// Close modal IMMEDIATELY (don't wait for server response)
		setIsEditOpen(false);
		setSaving(true);

		saveInFlightRef.current = true;
		userAbortedRef.current = false;

		const controller = new AbortController();
		saveControllerRef.current = controller;
		const timeoutId = setTimeout(() => controller.abort(), 15000);
		saveTimeoutRef.current = timeoutId;

		try {
			const token = sessionStorage.getItem("token");
			const username = sessionStorage.getItem("username") || "Sistema";
			if (!token)
				throw new Error("Sesión expirada. Vuelve a iniciar sesión.");

			// Detectar cambios comparando con originalValues
			const cambios = {};
			const original = originalValuesRef.current;

			if (payload.Name !== original.Name) {
				cambios.Nombre = {
					anterior: original.Name,
					nuevo: payload.Name,
				};
			}
			if (payload.LastName !== original.LastName) {
				cambios.Apellido = {
					anterior: original.LastName,
					nuevo: payload.LastName,
				};
			}
			if (payload.Phone !== original.Phone) {
				cambios.Teléfono = {
					anterior: original.Phone,
					nuevo: payload.Phone,
				};
			}
			if ((payload.Email || "") !== (original.Email || "")) {
				cambios.Email = {
					anterior: original.Email || "",
					nuevo: payload.Email || "",
				};
			}
			if (!!payload.Vip !== !!original.Vip) {
				cambios.VIP = {
					anterior: original.Vip ? "Sí" : "No",
					nuevo: payload.Vip ? "Sí" : "No",
				};
			}
			if (!!payload.Zumba !== !!original.Zumba) {
				cambios["Zumba"] = {
					anterior: original.Zumba ? "Sí" : "No",
					nuevo: payload.Zumba ? "Sí" : "No",
				};
			}
			if (!!payload.Box !== !!original.Box) {
				cambios["Box"] = {
					anterior: original.Box ? "Sí" : "No",
					nuevo: payload.Box ? "Sí" : "No",
				};
			}

			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/clientes/${id}`,
				{
					method: "PUT",
					signal: controller.signal,
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						username: username,
						cambios: cambios,
						data: {
							Name: payload.Name,
							LastName: payload.LastName,
							Phone: formattedPhone,
							Email: payload.Email || null,
							Vip: !!payload.Vip,
							Zumba: !!payload.Zumba,
							Box: !!payload.Box,
						},
					}),
				}
			);

			if (!res.ok) {
				const errorData = await res.json().catch(() => ({}));
				console.error("❌ Server error:", errorData);

				// Check for validation errors
				const fieldErrors = {};
				if (errorData?.error) {
					const msg = (errorData.error.message || "").toLowerCase();
					const details = errorData.error.details?.errors || [];

					// Check error details array
					details.forEach((err) => {
						const path = err.path?.[0] || "";
						const errMsg = (err.message || "").toLowerCase();

						if (
							path === "Phone" ||
							errMsg.includes("phone") ||
							errMsg.includes("teléfono")
						) {
							fieldErrors.Phone =
								"Este número de teléfono ya está registrado";
						}
						if (
							path === "Email" ||
							errMsg.includes("email") ||
							errMsg.includes("correo")
						) {
							if (
								errMsg.includes("valid") ||
								errMsg.includes("invalid") ||
								errMsg.includes("format")
							) {
								fieldErrors.Email =
									"Por favor ingresa un email válido";
							} else {
								fieldErrors.Email =
									"Este email ya está registrado";
							}
						}
					});

					// Check main error message
					if (msg.includes("phone") || msg.includes("teléfono")) {
						fieldErrors.Phone =
							"Este número de teléfono ya está registrado";
					} else if (
						msg.includes("email") ||
						msg.includes("correo")
					) {
						if (
							msg.includes("valid") ||
							msg.includes("invalid") ||
							msg.includes("format")
						) {
							fieldErrors.Email =
								"Por favor ingresa un email válido";
						} else if (
							msg.includes("unique") ||
							msg.includes("duplicate") ||
							msg.includes("already")
						) {
							fieldErrors.Email = "Este email ya está registrado";
						} else {
							fieldErrors.Email =
								"Por favor ingresa un email válido";
						}
					}
				}

				// If there are field errors, reopen modal to show them
				if (Object.keys(fieldErrors).length > 0) {
					setEditErrors(fieldErrors);
					setIsEditOpen(true);
				}

				throw new Error("Error al actualizar cliente");
			}

			console.log("✅ Cliente actualizado exitosamente");
			toast({
				title: "Cliente actualizado",
				description: "Los cambios se guardaron correctamente",
				status: "success",
				duration: 3000,
				isClosable: true,
			});

			fetchClientes();
		} catch (error) {
			console.error("❌ Error in handleEditSave:", error);
			if (error?.name === "AbortError" && userAbortedRef.current) {
				// User cancelled: no error toast.
				console.log("🚫 User aborted save");
			} else {
				toast({
					title: "Error",
					description:
						error?.name === "AbortError"
							? "Tiempo de espera agotado al guardar. Intenta nuevamente."
							: error?.message || "Error inesperado",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			}
		} finally {
			clearTimeout(timeoutId);
			if (saveTimeoutRef.current === timeoutId)
				saveTimeoutRef.current = null;
			if (saveControllerRef.current === controller)
				saveControllerRef.current = null;
			saveInFlightRef.current = false;
			setSaving(false);

			// Clean up state after save completes
			setEditingId(null);
			editingIdRef.current = null;
			setEditValues({ ...EMPTY_VALUES });
			setOriginalValues({ ...EMPTY_VALUES });
			originalValuesRef.current = EMPTY_VALUES;
			setEditErrors({});

			console.log("🏁 Save process finished");
		}
	};

	return (
		<Box p={6}>
			<ClientesHeader router={router} onOpenCreate={openCreate} />

			<ClientesFilters
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				filterVip={filterVip}
				setFilterVip={setFilterVip}
				filterZumbaBox={filterZumbaBox}
				setFilterZumbaBox={setFilterZumbaBox}
				pageSize={pageSize}
				setPageSize={setPageSize}
			/>

			{loading ? (
				<Flex justify="center" align="center" minH="200px">
					<Spinner size="xl" color="teal.500" />
				</Flex>
			) : filteredClientes.length === 0 ? (
				<Box textAlign="center" py={10}>
					<Text fontSize="lg" color="gray.500">
						No se encontraron clientes
					</Text>
				</Box>
			) : (
				<>
					<ClientesTable
						clientes={filteredClientes}
						pagos={pagos}
						currentPage={currentPage}
						pageSize={pageSize}
						onEdit={openEdit}
						onDelete={handleDelete}
						onView={handleView}
						sortField={sortField}
						sortDirection={sortDirection}
						onSort={handleSort}
					/>

					<ClientesPagination
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						totalPages={totalPages}
						pageSize={pageSize}
						totalCount={totalCount}
					/>
				</>
			)}

			<EditClienteModal
				isOpen={isEditOpen}
				onClose={closeEdit}
				onClosed={handleEditClosed}
				values={editValues}
				setValues={setEditValues}
				onSave={handleEditSave}
				saving={saving}
				dirty={dirty}
				errors={editErrors}
			/>

			<ClientForm
				isOpen={isCreateOpen}
				onClose={closeCreate}
				onClosed={handleCreateClosed}
				values={createValues}
				setValues={setCreateValues}
				onSave={handleCreateSave}
				saving={createSaving}
				errors={createErrors}
			/>
		</Box>
	);
}
