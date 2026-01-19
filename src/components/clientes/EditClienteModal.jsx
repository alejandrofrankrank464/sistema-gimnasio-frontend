"use client";

import {
	Button,
	FormControl,
	FormLabel,
	FormErrorMessage,
	HStack,
	Input,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerCloseButton,
	Switch,
} from "@chakra-ui/react";

export default function EditClienteModal({
	isOpen,
	onClose,
	onClosed,
	values,
	setValues,
	onSave,
	saving,
	dirty,
	errors,
}) {
	const safeValues = values ?? {
		Name: "",
		LastName: "",
		Phone: "",
		Email: "",
		Vip: false,
		Zumba: false,
		Box: false,
	};

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
				<DrawerHeader>Editar Cliente</DrawerHeader>
				<DrawerBody>
					<FormControl mb={3}>
						<FormLabel>Nombre</FormLabel>
						<Input
							value={safeValues.Name ?? ""}
							onChange={(e) =>
								setValues((v) => ({
									...(v ?? safeValues),
									Name: e.target.value,
								}))
							}
						/>
					</FormControl>
					<FormControl mb={3}>
						<FormLabel>Apellido</FormLabel>
						<Input
							value={safeValues.LastName ?? ""}
							onChange={(e) =>
								setValues((v) => ({
									...(v ?? safeValues),
									LastName: e.target.value,
								}))
							}
						/>
					</FormControl>
					<FormControl mb={3} isInvalid={!!errors?.Phone}>
						<FormLabel>Teléfono</FormLabel>
						<Input
							value={safeValues.Phone ?? ""}
							onChange={(e) =>
								setValues((v) => ({
									...(v ?? safeValues),
									Phone: e.target.value,
								}))
							}
						/>
						{errors?.Phone && (
							<FormErrorMessage>{errors.Phone}</FormErrorMessage>
						)}
					</FormControl>
					<FormControl mb={3} isInvalid={!!errors?.Email}>
						<FormLabel>Email</FormLabel>
						<Input
							type="email"
							value={safeValues.Email ?? ""}
							onChange={(e) =>
								setValues((v) => ({
									...(v ?? safeValues),
									Email: e.target.value,
								}))
							}
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
								onChange={(e) =>
									setValues((v) => ({
										...(v ?? safeValues),
										Vip: e.target.checked,
									}))
								}
							/>
						</FormControl>
						<FormControl display="flex" alignItems="center">
							<FormLabel mb="0">Box/Zumba</FormLabel>
							<Switch
								isChecked={!!safeValues.BoxZumba}
								onChange={(e) =>
									setValues((v) => ({
										...(v ?? safeValues),
										BoxZumba: e.target.checked,
									}))
								}
							/>
						</FormControl>
					</HStack>
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
						isDisabled={!dirty}
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
