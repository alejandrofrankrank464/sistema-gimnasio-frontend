"use client";

import {
	Button,
	FormControl,
	FormLabel,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerCloseButton,
	VStack,
	Text,
	Badge,
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

export default function EditPagoDrawer({
	isOpen,
	onClose,
	onClosed,
	values,
	setValues,
	onSave,
	saving,
	dirty,
	clienteName,
}) {
	const safeValues = values ?? {
		MetodoPago: "Efectivo",
		TipoServicio: "Normal",
		Turno: "",
	};

	const requiresTurno =
		safeValues.TipoServicio !== "VIP" &&
		safeValues.TipoServicio !== "VIP + Zumba y Box";

	return (
		<Drawer
			isOpen={isOpen}
			onClose={onClose}
			onCloseComplete={onClosed}
			size="md"
			placement="right"
			closeOnOverlayClick={!saving}
			closeOnEsc={!saving}
		>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>Editar Pago</DrawerHeader>
				<DrawerBody>
					<VStack spacing={4} align="stretch">
						{/* Cliente info (read-only) */}
						<Box>
							<Text fontSize="sm" color="gray.600" mb={1}>
								Cliente
							</Text>
							<Text fontSize="lg" fontWeight="bold">
								{clienteName}
							</Text>
						</Box>

						{/* Método de Pago */}
						<FormControl>
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
									{safeValues.MetodoPago ?? "Efectivo"}
								</MenuButton>
								<MenuList>
									<MenuItem
										onClick={() =>
											setValues((v) => ({
												...(v ?? safeValues),
												MetodoPago: "Efectivo",
											}))
										}
										bg={
											safeValues.MetodoPago === "Efectivo"
												? "teal.50"
												: "white"
										}
										fontWeight={
											safeValues.MetodoPago === "Efectivo"
												? "bold"
												: "normal"
										}
										_hover={{ bg: "teal.100" }}
									>
										Efectivo
									</MenuItem>
									<MenuItem
										onClick={() =>
											setValues((v) => ({
												...(v ?? safeValues),
												MetodoPago: "Tarjeta",
											}))
										}
										bg={
											safeValues.MetodoPago === "Tarjeta"
												? "teal.50"
												: "white"
										}
										fontWeight={
											safeValues.MetodoPago === "Tarjeta"
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

						{/* Tipo de Servicio */}
						<FormControl>
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
									{safeValues.TipoServicio ?? "Normal"}
								</MenuButton>
								<MenuList>
									<MenuItem
										onClick={() =>
											setValues((v) => ({
												...(v ?? safeValues),
												TipoServicio: "Normal",
												Turno: v?.Turno,
											}))
										}
										bg={
											safeValues.TipoServicio === "Normal"
												? "purple.50"
												: "white"
										}
										fontWeight={
											safeValues.TipoServicio === "Normal"
												? "bold"
												: "normal"
										}
										_hover={{ bg: "purple.100" }}
									>
										Normal
									</MenuItem>
									<MenuItem
										onClick={() =>
											setValues((v) => ({
												...(v ?? safeValues),
												TipoServicio: "VIP",
												Turno: null,
											}))
										}
										bg={
											safeValues.TipoServicio === "VIP"
												? "purple.50"
												: "white"
										}
										fontWeight={
											safeValues.TipoServicio === "VIP"
												? "bold"
												: "normal"
										}
										_hover={{ bg: "purple.100" }}
									>
										VIP
									</MenuItem>
									<MenuItem
										onClick={() =>
											setValues((v) => ({
												...(v ?? safeValues),
												TipoServicio: "Zumba",
												Turno: v?.Turno,
											}))
										}
										bg={
											safeValues.TipoServicio === "Zumba"
												? "purple.50"
												: "white"
										}
										fontWeight={
											safeValues.TipoServicio === "Zumba"
												? "bold"
												: "normal"
										}
										_hover={{ bg: "purple.100" }}
									>
										Zumba
									</MenuItem>
									<MenuItem
										onClick={() =>
											setValues((v) => ({
												...(v ?? safeValues),
												TipoServicio: "Box",
												Turno: v?.Turno,
											}))
										}
										bg={
											safeValues.TipoServicio === "Box"
												? "purple.50"
												: "white"
										}
										fontWeight={
											safeValues.TipoServicio === "Box"
												? "bold"
												: "normal"
										}
										_hover={{ bg: "purple.100" }}
									>
										Box
									</MenuItem>
									<MenuItem
										onClick={() =>
											setValues((v) => ({
												...(v ?? safeValues),
												TipoServicio: "Zumba y Box",
												Turno: v?.Turno,
											}))
										}
										bg={
											safeValues.TipoServicio ===
											"Zumba y Box"
												? "purple.50"
												: "white"
										}
										fontWeight={
											safeValues.TipoServicio ===
											"Zumba y Box"
												? "bold"
												: "normal"
										}
										_hover={{ bg: "purple.100" }}
									>
										Zumba y Box
									</MenuItem>
									<MenuItem
										onClick={() =>
											setValues((v) => ({
												...(v ?? safeValues),
												TipoServicio:
													"VIP + Zumba y Box",
												Turno: null,
											}))
										}
										bg={
											safeValues.TipoServicio ===
											"VIP + Zumba y Box"
												? "purple.50"
												: "white"
										}
										fontWeight={
											safeValues.TipoServicio ===
											"VIP + Zumba y Box"
												? "bold"
												: "normal"
										}
										_hover={{ bg: "purple.100" }}
									>
										VIP + Zumba y Box
									</MenuItem>
								</MenuList>
							</Menu>
						</FormControl>

						{/* Turno */}
						{requiresTurno ? (
							<FormControl>
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
										{safeValues.Turno ||
											"Selecciona un turno"}
									</MenuButton>
									<MenuList maxH="300px" overflowY="auto">
										{TURNOS.map((turno) => (
											<MenuItem
												key={turno}
												onClick={() =>
													setValues((v) => ({
														...(v ?? safeValues),
														Turno: turno,
													}))
												}
												bg={
													safeValues.Turno === turno
														? "cyan.50"
														: "white"
												}
												fontWeight={
													safeValues.Turno === turno
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
								{!safeValues.Turno && (
									<Text fontSize="xs" color="red.500" mt={1}>
										El turno es requerido
									</Text>
								)}
							</FormControl>
						) : (
							<Badge colorScheme="purple" p={2} fontSize="sm">
								Servicio VIP - Acceso a todos los turnos
							</Badge>
						)}
					</VStack>
				</DrawerBody>
				<DrawerFooter borderTopWidth="1px">
					<Button
						mr={3}
						onClick={onClose}
						variant="ghost"
						isDisabled={saving}
					>
						Cancelar
					</Button>
					<Button
						colorScheme="teal"
						onClick={onSave}
						isDisabled={
							!dirty || (requiresTurno && !safeValues.Turno)
						}
						isLoading={saving}
						loadingText="Guardando..."
					>
						Guardar
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
