"use client";

import {
	Button,
	FormControl,
	FormLabel,
	FormErrorMessage,
	HStack,
	Input,
	InputGroup,
	InputLeftAddon,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerCloseButton,
	Switch,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const COUNTRY_CODES = [
	{ code: "+53", name: "🇨🇺 Cuba", country: "CU" },
	{ code: "+1", name: "🇺🇸 USA/Canadá", country: "US" },
	{ code: "+52", name: "🇲🇽 México", country: "MX" },
	{ code: "+57", name: "🇨🇴 Colombia", country: "CO" },
	{ code: "+58", name: "🇻🇪 Venezuela", country: "VE" },
	{ code: "+51", name: "🇵🇪 Perú", country: "PE" },
	{ code: "+54", name: "🇦🇷 Argentina", country: "AR" },
	{ code: "+56", name: "🇨🇱 Chile", country: "CL" },
	{ code: "+55", name: "🇧🇷 Brasil", country: "BR" },
	{ code: "+34", name: "🇪🇸 España", country: "ES" },
	{ code: "+44", name: "🇬🇧 Reino Unido", country: "GB" },
	{ code: "+33", name: "🇫🇷 Francia", country: "FR" },
	{ code: "+49", name: "🇩🇪 Alemania", country: "DE" },
	{ code: "+39", name: "🇮🇹 Italia", country: "IT" },
];

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

export default function ClientForm({
	isOpen,
	onClose,
	onClosed,
	values,
	setValues,
	onSave,
	saving,
	errors,
}) {
	const safeValues = values ?? {
		Name: "",
		LastName: "",
		Phone: "",
		CountryCode: "+53",
		Email: "",
		Vip: false,
		Zumba: false,
		Box: false,
		Turno: "",
		MetodoPago: "Efectivo",
	};

	const hasRequiredFields = !!(
		safeValues.Name?.trim() &&
		safeValues.LastName?.trim() &&
		safeValues.Phone?.trim() &&
		(safeValues.Vip || safeValues.Turno?.trim())
	);

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
				<DrawerHeader>Registrar Nuevo Cliente</DrawerHeader>
				<DrawerBody>
					<FormControl mb={3} isRequired>
						<FormLabel>Nombre</FormLabel>
						<Input
							placeholder="Ingresa el nombre"
							value={safeValues.Name ?? ""}
							autoCapitalize="words"
							onChange={(e) => {
								let value = e.target.value;
								// Capitalizar primera letra solo si es la primera vez que se escribe
								if (
									value.length === 1 &&
									(!safeValues.Name ||
										safeValues.Name.length === 0)
								) {
									value =
										value.charAt(0).toUpperCase() +
										value.slice(1);
								}
								setValues((v) => ({
									...(v ?? safeValues),
									Name: value,
								}));
							}}
						/>
					</FormControl>
					<FormControl mb={3} isRequired>
						<FormLabel>Apellido</FormLabel>
						<Input
							placeholder="Ingresa el apellido"
							value={safeValues.LastName ?? ""}
							autoCapitalize="words"
							onChange={(e) => {
								let value = e.target.value;
								// Capitalizar primera letra solo si es la primera vez que se escribe
								if (
									value.length === 1 &&
									(!safeValues.LastName ||
										safeValues.LastName.length === 0)
								) {
									value =
										value.charAt(0).toUpperCase() +
										value.slice(1);
								}
								setValues((v) => ({
									...(v ?? safeValues),
									LastName: value,
								}));
							}}
						/>
					</FormControl>
					<FormControl mb={3} isRequired isInvalid={!!errors?.Phone}>
						<FormLabel>Teléfono</FormLabel>
						<HStack spacing={2} align="start">
							<Menu>
								<MenuButton
									as={Button}
									rightIcon={<ChevronDownIcon />}
									variant="outline"
									minW="140px"
								>
									{safeValues.CountryCode ?? "+53"}
								</MenuButton>
								<MenuList
									maxH="300px"
									overflowY="auto"
									zIndex={1500}
								>
									{COUNTRY_CODES.map((country) => (
										<MenuItem
											key={country.code}
											onClick={() =>
												setValues((v) => ({
													...(v ?? safeValues),
													CountryCode: country.code,
												}))
											}
											bg={
												safeValues.CountryCode ===
												country.code
													? "blue.50"
													: "white"
											}
											fontWeight={
												safeValues.CountryCode ===
												country.code
													? "bold"
													: "normal"
											}
											_hover={{ bg: "blue.100" }}
										>
											{country.code} {country.name}
										</MenuItem>
									))}
								</MenuList>
							</Menu>
							<Input
								type="tel"
								placeholder="300 123 4567"
								value={safeValues.Phone ?? ""}
								onChange={(e) => {
									// Solo permitir números y espacios
									const value = e.target.value.replace(
										/[^0-9\s]/g,
										""
									);
									setValues((v) => ({
										...(v ?? safeValues),
										Phone: value,
									}));
								}}
								flex="1"
							/>
						</HStack>
						{errors?.Phone && (
							<FormErrorMessage>{errors.Phone}</FormErrorMessage>
						)}
					</FormControl>
					<FormControl mb={3} isInvalid={!!errors?.Email}>
						<FormLabel>Email</FormLabel>
						<Input
							type="email"
							placeholder="Ingresa el email (opcional)"
							value={safeValues.Email ?? ""}
							onChange={(e) =>
								setValues((v) => ({
									...(v ?? safeValues),
									Email: e.target.value,
								}))
							}
							onBlur={(e) => {
								const email = e.target.value.trim();
								if (
									email &&
									!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
								) {
									if (errors && !errors.Email) {
										// Solo mostrar advertencia visual, no bloquear
									}
								}
							}}
						/>
						{errors?.Email && (
							<FormErrorMessage>{errors.Email}</FormErrorMessage>
						)}
					</FormControl>
					<HStack mt={2} spacing={6}>
						<FormControl display="flex" alignItems="center">
							<FormLabel mb="0">VIP</FormLabel>
							<Switch
								isChecked={!!safeValues.Vip}
								onChange={(e) => {
									setValues((v) => ({
										...(v ?? safeValues),
										Vip: e.target.checked,
									}));
								}}
							/>
						</FormControl>
						<FormControl display="flex" alignItems="center">
							<FormLabel mb="0">Zumba</FormLabel>
							<Switch
								isChecked={!!safeValues.Zumba}
								onChange={(e) =>
									setValues((v) => ({
										...(v ?? safeValues),
										Zumba: e.target.checked,
									}))
								}
							/>
						</FormControl>
						<FormControl display="flex" alignItems="center">
							<FormLabel mb="0">Box</FormLabel>
							<Switch
								isChecked={!!safeValues.Box}
								onChange={(e) =>
									setValues((v) => ({
										...(v ?? safeValues),
										Box: e.target.checked,
									}))
								}
							/>
						</FormControl>
					</HStack>
					{!safeValues.Vip && (
						<FormControl mt={3} isRequired>
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
									{safeValues.Turno || "Selecciona un turno"}
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
						</FormControl>
					)}
					<FormControl mt={3} isRequired>
						<FormLabel>Método de Pago (primer pago)</FormLabel>
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
						isDisabled={!hasRequiredFields}
						isLoading={saving}
						loadingText="Registrando..."
					>
						Registrar
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
