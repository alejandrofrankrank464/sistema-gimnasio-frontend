"use client";

import { useState, useEffect, useCallback } from "react";
import {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
	Button,
	FormControl,
	FormLabel,
	Input,
	useToast,
	VStack,
	HStack,
	Text,
	Box,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const TURNOS = [
	"de 7:00 am a 8:00 am",
	"de 8:00 am a 9:00 am",
	"de 9:00 am a 10:00 am",
	"de 10:00 am a 11:00 am",
	"de 11:00 am a 12:00 pm",
	"de 1:00 pm a 2:00 pm",
	"de 2:00 pm a 3:00 pm",
	"de 3:00 pm a 4:00 pm",
	"de 4:00 pm a 5:00 pm",
	"de 5:00 pm a 6:00 pm",
	"de 6:00 pm a 7:00 pm",
	"de 7:00 pm a 8:00 pm",
];

const MONTHS = [
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

export default function PagosForm({ isOpen, onClose, onSuccess }) {
	const [clientes, setClientes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchCliente, setSearchCliente] = useState("");
	const [precios, setPrecios] = useState({
		Normal: 0,
		VIP: 0,
		Zumba: 0,
		Box: 0,
		"Zumba o Box": 0,
		"Zumba y Box": 0,
		"VIP + Zumba y Box": 0,
	});
	const currentDate = new Date();
	const [formData, setFormData] = useState({
		cliente: "",
		MetodoPago: "Efectivo",
		mes: currentDate.getMonth(),
		anio: currentDate.getFullYear(),
		TipoServicio: "Normal",
		Turno: "",
	});
	const [pagosExistentes, setPagosExistentes] = useState([]);

	// Generate years (current - 1 to current + 1)
	const years = Array.from(
		{ length: 3 },
		(_, i) => currentDate.getFullYear() - 1 + i
	);
	const toast = useToast();

	const fetchPrecios = useCallback(async () => {
		try {
			const token = sessionStorage.getItem("token");
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/configuraciones/precios`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (!res.ok) throw new Error("Error al cargar precios");
			const data = await res.json();

			if (data && data.data) {
				const preciosData = data.data;

				setPrecios({
					Normal: preciosData.precio_normal || 0,
					VIP: preciosData.precio_vip || 0,
					Zumba: preciosData.precio_zumba_o_box || 0,
					Box: preciosData.precio_zumba_o_box || 0,
					"Zumba o Box": preciosData.precio_zumba_o_box || 0,
					"Zumba y Box": preciosData.precio_zumba_y_box || 0,
					"VIP + Zumba y Box":
						preciosData.precio_vip_zumba_y_box || 0,
				});
			}
		} catch (error) {
			console.error("Error fetching precios:", error);
			toast({
				title: "Error",
				description: error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	}, [toast]);

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
			toast({
				title: "Error",
				description: error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	}, [toast]);

	const fetchPagos = useCallback(async () => {
		try {
			const token = localStorage.getItem("token");
			const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/pagos`);
			url.searchParams.set("populate", "cliente");
			url.searchParams.set("pagination[pageSize]", "1000");

			const res = await fetch(url.toString(), {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (!res.ok) throw new Error("Error al cargar pagos");
			const data = await res.json();
			setPagosExistentes(data.data || []);
		} catch (error) {
			console.error("Error fetching pagos:", error);
		}
	}, []);

	useEffect(() => {
		if (isOpen) {
			fetchPrecios();
			fetchClientes();
			fetchPagos();
		}
	}, [isOpen, fetchPrecios, fetchClientes, fetchPagos]);

	const handleChange = (field, value) => {
		setFormData((prev) => {
			const updated = { ...prev, [field]: value };

			// Solo VIP y VIP + Zumba y Box no requieren turno
			if (field === "TipoServicio") {
				const noRequiereTurno = ["VIP", "VIP + Zumba y Box"];
				if (noRequiereTurno.includes(value)) {
					updated.Turno = "";
				}
			}

			// Limpiar búsqueda cuando se selecciona un cliente
			if (field === "cliente") {
				setSearchCliente("");
			}

			return updated;
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.cliente) {
			toast({
				title: "Error",
				description: "Debes seleccionar un cliente",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		// Verificar si ya existe un pago para este cliente en este mes/año
		const pagoExistente = pagosExistentes.find((pago) => {
			const attrs = pago.attributes || pago;
			const clienteId = attrs.cliente?.id || attrs.cliente;

			if (clienteId !== parseInt(formData.cliente)) return false;

			// Check using MesPago and AnioPago fields
			return (
				attrs.AnioPago === formData.anio &&
				attrs.MesPago === formData.mes
			);
		});

		if (pagoExistente) {
			toast({
				title: "Pago duplicado",
				description: `Ya existe un pago registrado para este cliente en ${
					MONTHS[formData.mes]
				} ${formData.anio}`,
				status: "warning",
				duration: 4000,
				isClosable: true,
			});
			return;
		}

		setLoading(true);

		try {
			const token = sessionStorage.getItem("token");

			// Calculate amount based on service type
			const monto = precios[formData.TipoServicio] || 0;

			// FechaPago is the actual date when the payment is registered (today in local timezone)
			const today = new Date();
			const fechaPago = `${today.getFullYear()}-${String(
				today.getMonth() + 1
			).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

			const payload = {
				username: sessionStorage.getItem("username") || "Sistema",
				data: {
					cliente: formData.cliente,
					Monto: monto,
					MetodoPago: formData.MetodoPago,
					FechaPago: fechaPago,
					MesPago: formData.mes,
					AnioPago: formData.anio,
					TipoServicio: formData.TipoServicio,
					Turno:
						formData.TipoServicio !== "VIP" &&
						formData.TipoServicio !== "VIP + Zumba y Box"
							? formData.Turno || null
							: null,
				},
			};

			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/pagos`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(payload),
				}
			);

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(
					errorData.error?.message || "Error al registrar pago"
				);
			}

			toast({
				title: "Pago registrado",
				description: "El pago se ha registrado exitosamente",
				status: "success",
				duration: 3000,
				isClosable: true,
			});

			// Reset form
			const resetDate = new Date();
			setFormData({
				cliente: "",
				MetodoPago: "Efectivo",
				mes: resetDate.getMonth(),
				anio: resetDate.getFullYear(),
				TipoServicio: "Normal",
				Turno: "",
			});

			onSuccess();
			onClose();
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
	};

	// Filtrar clientes por búsqueda
	const filteredClientes = clientes.filter((cliente) => {
		const attrs = cliente.attributes || cliente;
		const searchLower = searchCliente.toLowerCase();
		return (
			attrs.Name?.toLowerCase().includes(searchLower) ||
			attrs.LastName?.toLowerCase().includes(searchLower) ||
			attrs.Phone?.includes(searchCliente)
		);
	});

	// Todos los servicios requieren turno excepto VIP y VIP + Zumba y Box
	const requiresTurno =
		formData.TipoServicio !== "VIP" &&
		formData.TipoServicio !== "VIP + Zumba y Box";

	return (
		<Drawer isOpen={isOpen} onClose={onClose} size="md" placement="right">
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>Registrar Pago</DrawerHeader>
				<form onSubmit={handleSubmit}>
					<DrawerBody>
						<VStack spacing={4}>
							<FormControl isRequired>
								<FormLabel>Cliente</FormLabel>
								<Menu>
									<MenuButton
										as={Button}
										rightIcon={<ChevronDownIcon />}
										colorScheme="teal"
										variant="outline"
										width="100%"
										textAlign="left"
									>
										{formData.cliente
											? (() => {
													const cliente =
														clientes.find(
															(c) =>
																c.id ===
																parseInt(
																	formData.cliente
																)
														);
													if (cliente) {
														const attrs =
															cliente.attributes ||
															cliente;
														return `${attrs.Name} ${attrs.LastName} - ${attrs.Phone}`;
													}
													return "Selecciona un cliente";
											  })()
											: "Selecciona un cliente"}
									</MenuButton>
									<MenuList maxH="300px" overflowY="auto">
										<Box
											px={3}
											py={2}
											borderBottomWidth="1px"
										>
											<Input
												placeholder="Buscar por nombre o teléfono..."
												value={searchCliente}
												onChange={(e) =>
													setSearchCliente(
														e.target.value
													)
												}
												size="sm"
												autoFocus
												isRequired={false}
											/>
										</Box>
										{filteredClientes.length === 0 ? (
											<Text
												px={3}
												py={2}
												color="gray.500"
												fontSize="sm"
											>
												No se encontraron clientes
											</Text>
										) : (
											filteredClientes.map((cliente) => {
												const attrs =
													cliente.attributes ||
													cliente;
												return (
													<MenuItem
														key={cliente.id}
														onClick={() =>
															handleChange(
																"cliente",
																cliente.id
															)
														}
														bg={
															formData.cliente ===
															cliente.id
																? "teal.50"
																: "white"
														}
														fontWeight={
															formData.cliente ===
															cliente.id
																? "bold"
																: "normal"
														}
														_hover={{
															bg: "teal.100",
														}}
													>
														{attrs.Name}{" "}
														{attrs.LastName} -{" "}
														{attrs.Phone}
													</MenuItem>
												);
											})
										)}
									</MenuList>
								</Menu>
							</FormControl>

							<HStack spacing={4} width="100%">
								<FormControl isRequired>
									<FormLabel>Método de Pago</FormLabel>
									<Menu>
										<MenuButton
											as={Button}
											rightIcon={<ChevronDownIcon />}
											colorScheme="teal"
											variant="outline"
											width="100%"
											textAlign="left"
										>
											{formData.MetodoPago}
										</MenuButton>
										<MenuList>
											<MenuItem
												onClick={() =>
													handleChange(
														"MetodoPago",
														"Efectivo"
													)
												}
												bg={
													formData.MetodoPago ===
													"Efectivo"
														? "teal.50"
														: "white"
												}
												fontWeight={
													formData.MetodoPago ===
													"Efectivo"
														? "bold"
														: "normal"
												}
												_hover={{ bg: "teal.100" }}
											>
												Efectivo
											</MenuItem>
											<MenuItem
												onClick={() =>
													handleChange(
														"MetodoPago",
														"Tarjeta"
													)
												}
												bg={
													formData.MetodoPago ===
													"Tarjeta"
														? "teal.50"
														: "white"
												}
												fontWeight={
													formData.MetodoPago ===
													"Tarjeta"
														? "bold"
														: "normal"
												}
												_hover={{ bg: "teal.100" }}
											>
												Tarjeta
											</MenuItem>
										</MenuList>
									</Menu>
								</FormControl>
							</HStack>

							<HStack spacing={4} width="100%">
								<FormControl isRequired flex={2}>
									<FormLabel>Mes de Pago</FormLabel>
									<Menu>
										<MenuButton
											as={Button}
											rightIcon={<ChevronDownIcon />}
											colorScheme="teal"
											variant="outline"
											width="100%"
											textAlign="left"
										>
											{MONTHS[formData.mes]}
										</MenuButton>
										<MenuList maxH="300px" overflowY="auto">
											{MONTHS.map((month, index) => (
												<MenuItem
													key={index}
													onClick={() =>
														handleChange(
															"mes",
															index
														)
													}
													bg={
														formData.mes === index
															? "teal.50"
															: "white"
													}
													fontWeight={
														formData.mes === index
															? "bold"
															: "normal"
													}
													_hover={{ bg: "teal.100" }}
												>
													{month}
												</MenuItem>
											))}
										</MenuList>
									</Menu>
								</FormControl>

								<FormControl isRequired flex={1}>
									<FormLabel>Año</FormLabel>
									<Menu>
										<MenuButton
											as={Button}
											rightIcon={<ChevronDownIcon />}
											colorScheme="purple"
											variant="outline"
											width="100%"
											textAlign="left"
										>
											{formData.anio}
										</MenuButton>
										<MenuList>
											{years.map((year) => (
												<MenuItem
													key={year}
													onClick={() =>
														handleChange(
															"anio",
															year
														)
													}
													bg={
														formData.anio === year
															? "purple.50"
															: "white"
													}
													fontWeight={
														formData.anio === year
															? "bold"
															: "normal"
													}
													_hover={{
														bg: "purple.100",
													}}
												>
													{year}
												</MenuItem>
											))}
										</MenuList>
									</Menu>
								</FormControl>
							</HStack>

							<FormControl isRequired>
								<FormLabel>Tipo de Servicio</FormLabel>
								<Menu>
									<MenuButton
										as={Button}
										rightIcon={<ChevronDownIcon />}
										colorScheme="purple"
										variant="outline"
										width="100%"
										textAlign="left"
									>
										{formData.TipoServicio}
									</MenuButton>
									<MenuList maxH="300px" overflowY="auto">
										{Object.keys(precios).map(
											(nombreServicio) => (
												<MenuItem
													key={nombreServicio}
													onClick={() =>
														handleChange(
															"TipoServicio",
															nombreServicio
														)
													}
													bg={
														formData.TipoServicio ===
														nombreServicio
															? "purple.50"
															: "white"
													}
													fontWeight={
														formData.TipoServicio ===
														nombreServicio
															? "bold"
															: "normal"
													}
													_hover={{
														bg: "purple.100",
													}}
												>
													{nombreServicio} - $
													{precios[nombreServicio]}
												</MenuItem>
											)
										)}
									</MenuList>
								</Menu>
								<Text fontSize="xs" color="gray.500" mt={1}>
									Monto: $
									{precios[formData.TipoServicio] || 0}
								</Text>
							</FormControl>

							{requiresTurno && (
								<FormControl isRequired>
									<FormLabel>Turno</FormLabel>
									<Menu>
										<MenuButton
											as={Button}
											rightIcon={<ChevronDownIcon />}
											colorScheme="cyan"
											variant="outline"
											width="100%"
											textAlign="left"
										>
											{formData.Turno ||
												"Selecciona un turno"}
										</MenuButton>
										<MenuList maxH="300px" overflowY="auto">
											{TURNOS.map((turno) => (
												<MenuItem
													key={turno}
													onClick={() =>
														handleChange(
															"Turno",
															turno
														)
													}
													bg={
														formData.Turno === turno
															? "cyan.50"
															: "white"
													}
													fontWeight={
														formData.Turno === turno
															? "bold"
															: "normal"
													}
													_hover={{ bg: "cyan.100" }}
												>
													{turno}
												</MenuItem>
											))}
										</MenuList>
									</Menu>
									{!formData.Turno && (
										<Text
											fontSize="xs"
											color="red.500"
											mt={1}
										>
											El turno es requerido
										</Text>
									)}
								</FormControl>
							)}

							{formData.TipoServicio === "VIP" && (
								<Text
									fontSize="sm"
									color="gray.500"
									fontStyle="italic"
								>
									Acceso VIP: Todos los turnos (Lun-Vie)
								</Text>
							)}
							{formData.TipoServicio === "VIP + Zumba y Box" && (
								<Text
									fontSize="sm"
									color="purple.600"
									fontStyle="italic"
									fontWeight="semibold"
								>
									Acceso VIP: Todos los turnos (Lun-Vie) +
									Zumba/Box (Sáb)
								</Text>
							)}
						</VStack>
					</DrawerBody>

					<DrawerFooter borderTopWidth="1px">
						<Button variant="ghost" mr={3} onClick={onClose}>
							Cancelar
						</Button>
						<Button
							colorScheme="teal"
							type="submit"
							isLoading={loading}
							isDisabled={
								!formData.cliente ||
								(requiresTurno && !formData.Turno)
							}
						>
							Registrar Pago
						</Button>
					</DrawerFooter>
				</form>
			</DrawerContent>
		</Drawer>
	);
}
