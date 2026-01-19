"use client";

import {
	Box,
	Container,
	Heading,
	VStack,
	FormControl,
	FormLabel,
	Input,
	Button,
	Text,
	Divider,
	Card,
	CardHeader,
	CardBody,
	useToast,
	InputGroup,
	InputLeftElement,
	Image,
	Flex,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ArrowBackIcon, DownloadIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";

export default function Ajustes() {
	const router = useRouter();
	const toast = useToast();
	const [precios, setPrecios] = useState({
		precio_normal: 0,
		precio_vip: 0,
		precio_zumba_o_box: 0,
		precio_zumba_y_box: 0,
		precio_vip_zumba_y_box: 0,
	});
	const [userInfo, setUserInfo] = useState({
		username: "",
		email: "",
	});
	const [logoUrl, setLogoUrl] = useState(null);
	const [uploadingLogo, setUploadingLogo] = useState(false);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [exportando, setExportando] = useState(false);
	const [fechaDesde, setFechaDesde] = useState("");
	const [fechaHasta, setFechaHasta] = useState("");
	const [entidadFiltro, setEntidadFiltro] = useState("Todas");
	const [accionFiltro, setAccionFiltro] = useState("Todas");

	useEffect(() => {
		fetchPrecios();
		fetchUserInfo();
		fetchLogo();
	}, []);

	const fetchUserInfo = async () => {
		try {
			const token = sessionStorage.getItem("token");
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (res.ok) {
				const data = await res.json();
				setUserInfo({
					username: data.username || "",
					email: data.email || "",
				});
			}
		} catch (error) {
			console.error("Error al cargar información del usuario:", error);
		}
	};

	const fetchLogo = async () => {
		try {
			const token = sessionStorage.getItem("token");
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/configuraciones/logo`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (res.ok) {
				const data = await res.json();
				if (data.data && data.data.url) {
					setLogoUrl(
						`${process.env.NEXT_PUBLIC_API_URL}${data.data.url}`
					);
				}
			}
		} catch (error) {
			console.error("Error al cargar logo:", error);
		}
	};

	const handleLogoUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploadingLogo(true);
		try {
			const token = sessionStorage.getItem("token");
			const formData = new FormData();
			formData.append("logo", file);

			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/configuraciones/logo`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				}
			);

			if (res.ok) {
				const data = await res.json();
				setLogoUrl(
					`${process.env.NEXT_PUBLIC_API_URL}${data.data.url}`
				);
				toast({
					title: "Logo actualizado",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			} else {
				throw new Error("Error al subir logo");
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "No se pudo subir el logo",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setUploadingLogo(false);
		}
	};

	const fetchPrecios = async () => {
		try {
			const token = sessionStorage.getItem("token");
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/configuraciones/precios`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (res.ok) {
				const data = await res.json();
				console.log("Precios recibidos:", data);
				if (data.data) {
					setPrecios(data.data);
				}
			} else {
				console.error("Error en la respuesta:", res.status);
			}
		} catch (error) {
			console.error("Error al cargar precios:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSavePrecios = async () => {
		setSaving(true);
		try {
			const token = sessionStorage.getItem("token");

			// Guardar cada precio
			for (const [clave, valor] of Object.entries(precios)) {
				await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/configuraciones/upsert`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({ clave, valor }),
					}
				);
			}

			toast({
				title: "Precios actualizados",
				description: "Los cambios se guardaron correctamente",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "No se pudieron guardar los precios",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setSaving(false);
		}
	};

	const handleExportarReportes = async () => {
		if (!fechaDesde || !fechaHasta) {
			toast({
				title: "Fechas requeridas",
				description: "Por favor selecciona las fechas de inicio y fin",
				status: "warning",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		setExportando(true);
		try {
			const token = sessionStorage.getItem("token");
			const params = new URLSearchParams({
				fechaDesde,
				fechaHasta,
			});

			if (entidadFiltro !== "Todas") {
				params.append("entidad", entidadFiltro);
			}
			if (accionFiltro !== "Todas") {
				params.append("accion", accionFiltro);
			}

			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/logs/export-excel?${params}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!res.ok) throw new Error("Error al generar Excel");

			const blob = await res.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `reportes_${fechaDesde}_${fechaHasta}.xlsx`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);

			toast({
				title: "Excel generado",
				description: "El reporte se descargó correctamente",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "No se pudo generar el archivo Excel",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setExportando(false);
		}
	};

	return (
		<Box minH="100vh" bg="gray.50" py={6}>
			<Container maxW="800px">
				<VStack spacing={6} align="stretch">
					<Box>
						<Button
							leftIcon={<ArrowBackIcon />}
							variant="ghost"
							onClick={() => router.push("/home")}
							mb={4}
						>
							Volver al inicio
						</Button>
						<Heading size="lg">Ajustes</Heading>
						<Text color="gray.600" mt={2}>
							Configuración del sistema
						</Text>
					</Box>

					<Card>
						<CardHeader>
							<Heading size="md">
								Información de la Cuenta
							</Heading>
						</CardHeader>
						<CardBody>
							<VStack spacing={4} align="stretch">
								<FormControl>
									<FormLabel>Usuario</FormLabel>
									<Input
										value={userInfo.username}
										isReadOnly
										bg="gray.100"
										cursor="not-allowed"
									/>
								</FormControl>

								<FormControl>
									<FormLabel>Email</FormLabel>
									<Input
										value={userInfo.email}
										isReadOnly
										bg="gray.100"
										cursor="not-allowed"
									/>
								</FormControl>

								<Text fontSize="sm" color="gray.500">
									Para cambiar tu información, contacta al
									administrador del sistema.
								</Text>
							</VStack>
						</CardBody>
					</Card>

					<Card>
						<CardHeader>
							<Heading size="md">Logo del Gimnasio</Heading>
						</CardHeader>
						<CardBody>
							<VStack spacing={4} align="stretch">
								{logoUrl && (
									<Flex
										justify="center"
										p={4}
										bg="gray.50"
										borderRadius="md"
										borderWidth="1px"
										borderColor="gray.200"
									>
										<Image
											src={logoUrl}
											alt="Logo del gimnasio"
											maxH="150px"
											objectFit="contain"
										/>
									</Flex>
								)}

								<FormControl>
									<FormLabel>Subir nuevo logo</FormLabel>
									<Input
										type="file"
										accept="image/*"
										onChange={handleLogoUpload}
										disabled={uploadingLogo}
										display="none"
										id="logo-upload"
									/>
									<Button
										as="label"
										htmlFor="logo-upload"
										colorScheme="teal"
										variant="outline"
										width="full"
										cursor="pointer"
										isDisabled={uploadingLogo}
										_hover={{
											bg: "teal.50",
											borderColor: "teal.500",
										}}
									>
										{uploadingLogo
											? "Subiendo..."
											: logoUrl
											? "Cambiar logo"
											: "Seleccionar logo"}
									</Button>
								</FormControl>
								<Text fontSize="sm" color="gray.500">
									Formatos aceptados: JPG, PNG, GIF. Tamaño
									recomendado: 300x100px
								</Text>
							</VStack>
						</CardBody>
					</Card>

					<Card>
						{" "}
						<CardHeader>
							<Heading size="md">Precios de Servicios</Heading>
						</CardHeader>
						<CardBody>
							{loading ? (
								<Text>Cargando precios...</Text>
							) : (
								<VStack spacing={4} align="stretch">
									<FormControl>
										<FormLabel>Servicio Normal</FormLabel>
										<InputGroup>
											<InputLeftElement
												pointerEvents="none"
												color="gray.500"
											>
												$
											</InputLeftElement>
											<Input
												type="number"
												value={precios.precio_normal}
												onChange={(e) => {
													const val = e.target.value;
													setPrecios({
														...precios,
														precio_normal:
															val === ""
																? ""
																: parseFloat(
																		val
																  ) || "",
													});
												}}
												onBlur={(e) => {
													const val =
														parseFloat(
															e.target.value
														) || 0;
													setPrecios({
														...precios,
														precio_normal: val,
													});
												}}
												pl={8}
											/>
										</InputGroup>
									</FormControl>

									<FormControl>
										<FormLabel>Servicio VIP</FormLabel>
										<InputGroup>
											<InputLeftElement
												pointerEvents="none"
												color="gray.500"
											>
												$
											</InputLeftElement>
											<Input
												type="number"
												value={precios.precio_vip}
												onChange={(e) => {
													const val = e.target.value;
													setPrecios({
														...precios,
														precio_vip:
															val === ""
																? ""
																: parseFloat(
																		val
																  ) || "",
													});
												}}
												onBlur={(e) => {
													const val =
														parseFloat(
															e.target.value
														) || 0;
													setPrecios({
														...precios,
														precio_vip: val,
													});
												}}
												pl={8}
											/>
										</InputGroup>
									</FormControl>

									<FormControl>
										<FormLabel>
											Zumba o Box (uno de los dos)
										</FormLabel>
										<InputGroup>
											<InputLeftElement
												pointerEvents="none"
												color="gray.500"
											>
												$
											</InputLeftElement>
											<Input
												type="number"
												value={
													precios.precio_zumba_o_box
												}
												onChange={(e) => {
													const val = e.target.value;
													setPrecios({
														...precios,
														precio_zumba_o_box:
															val === ""
																? ""
																: parseFloat(
																		val
																  ) || "",
													});
												}}
												onBlur={(e) => {
													const val =
														parseFloat(
															e.target.value
														) || 0;
													setPrecios({
														...precios,
														precio_zumba_o_box: val,
													});
												}}
												pl={8}
											/>
										</InputGroup>
									</FormControl>

									<FormControl>
										<FormLabel>
											Zumba y Box (ambos)
										</FormLabel>
										<InputGroup>
											<InputLeftElement
												pointerEvents="none"
												color="gray.500"
											>
												$
											</InputLeftElement>
											<Input
												type="number"
												value={
													precios.precio_zumba_y_box
												}
												onChange={(e) => {
													const val = e.target.value;
													setPrecios({
														...precios,
														precio_zumba_y_box:
															val === ""
																? ""
																: parseFloat(
																		val
																  ) || "",
													});
												}}
												onBlur={(e) => {
													const val =
														parseFloat(
															e.target.value
														) || 0;
													setPrecios({
														...precios,
														precio_zumba_y_box: val,
													});
												}}
												pl={8}
											/>
										</InputGroup>
									</FormControl>

									<FormControl>
										<FormLabel>VIP + Zumba y Box</FormLabel>
										<InputGroup>
											<InputLeftElement
												pointerEvents="none"
												color="gray.500"
											>
												$
											</InputLeftElement>
											<Input
												type="number"
												value={
													precios.precio_vip_zumba_y_box
												}
												onChange={(e) => {
													const val = e.target.value;
													setPrecios({
														...precios,
														precio_vip_zumba_y_box:
															val === ""
																? ""
																: parseFloat(
																		val
																  ) || "",
													});
												}}
												onBlur={(e) => {
													const val =
														parseFloat(
															e.target.value
														) || 0;
													setPrecios({
														...precios,
														precio_vip_zumba_y_box:
															val,
													});
												}}
												pl={8}
											/>
										</InputGroup>
									</FormControl>

									<Button
										colorScheme="teal"
										onClick={handleSavePrecios}
										isLoading={saving}
										loadingText="Guardando..."
									>
										Guardar Precios
									</Button>

									<Text fontSize="sm" color="gray.500">
										Estos precios se aplicarán
										automáticamente al crear nuevos
										clientes.
									</Text>
								</VStack>
							)}
						</CardBody>
					</Card>

					<Card>
						<CardHeader>
							<Heading size="md">
								Exportar Reportes a Excel
							</Heading>
						</CardHeader>
						<CardBody>
							<VStack spacing={4} align="stretch">
								<FormControl isRequired>
									<FormLabel>Fecha desde</FormLabel>
									<Input
										type="date"
										value={fechaDesde}
										onChange={(e) =>
											setFechaDesde(e.target.value)
										}
									/>
								</FormControl>

								<FormControl isRequired>
									<FormLabel>Fecha hasta</FormLabel>
									<Input
										type="date"
										value={fechaHasta}
										onChange={(e) =>
											setFechaHasta(e.target.value)
										}
									/>
								</FormControl>

								<FormControl>
									<FormLabel>Filtrar por entidad</FormLabel>
									<select
										style={{
											width: "100%",
											padding: "8px 12px",
											borderRadius: "6px",
											border: "1px solid #E2E8F0",
											backgroundColor: "white",
										}}
										value={entidadFiltro}
										onChange={(e) =>
											setEntidadFiltro(e.target.value)
										}
									>
										<option value="Todas">Todas</option>
										<option value="Cliente">Cliente</option>
										<option value="Pago">Pago</option>
										<option value="Precios">Precios</option>
										<option value="Logo">Logo</option>
									</select>
								</FormControl>

								<FormControl>
									<FormLabel>Filtrar por acción</FormLabel>
									<select
										style={{
											width: "100%",
											padding: "8px 12px",
											borderRadius: "6px",
											border: "1px solid #E2E8F0",
											backgroundColor: "white",
										}}
										value={accionFiltro}
										onChange={(e) =>
											setAccionFiltro(e.target.value)
										}
									>
										<option value="Todas">Todas</option>
										<option value="Crear">Crear</option>
										<option value="Editar">Editar</option>
										<option value="Eliminar">
											Eliminar
										</option>
										<option value="Actualizar">
											Actualizar
										</option>
									</select>
								</FormControl>

								<Button
									leftIcon={<DownloadIcon />}
									colorScheme="purple"
									onClick={handleExportarReportes}
									isLoading={exportando}
									loadingText="Generando Excel..."
								>
									Descargar Excel
								</Button>

								<Text fontSize="sm" color="gray.500">
									Genera un archivo Excel con los reportes de
									actividad del sistema en el rango de fechas
									seleccionado.
								</Text>
							</VStack>
						</CardBody>
					</Card>

					<Card>
						<CardHeader>
							<Heading size="md">Información del Sistema</Heading>
						</CardHeader>
						<CardBody>
							<VStack spacing={3} align="stretch">
								<Box>
									<Text fontWeight="semibold" fontSize="sm">
										Versión
									</Text>
									<Text color="gray.600">1.0.0</Text>
								</Box>
								<Divider />
								<Box>
									<Text fontWeight="semibold" fontSize="sm">
										Última actualización
									</Text>
									<Text color="gray.600">Enero 2026</Text>
								</Box>
							</VStack>
						</CardBody>
					</Card>
				</VStack>
			</Container>
		</Box>
	);
}
