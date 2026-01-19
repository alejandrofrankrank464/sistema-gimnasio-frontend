import {
	Flex,
	Box,
	Text,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ENTIDADES, ACCIONES } from "./constants";

export default function ReportesFilters({
	filterEntidad,
	setFilterEntidad,
	filterAccion,
	setFilterAccion,
	accionesUnicas,
}) {
	return (
		<Flex gap={4} mb={6} align="center" wrap="wrap">
			<Box>
				<Text fontSize="sm" mb={2} fontWeight="medium" color="gray.600">
					Entidad
				</Text>
				<Menu>
					<MenuButton
						as={Button}
						rightIcon={<ChevronDownIcon />}
						colorScheme="teal"
						variant="outline"
						width="150px"
						textAlign="left"
						fontWeight="medium"
					>
						{filterEntidad}
					</MenuButton>
					<MenuList>
						{ENTIDADES.map((entidad) => (
							<MenuItem
								key={entidad}
								onClick={() => setFilterEntidad(entidad)}
								bg={
									filterEntidad === entidad
										? "teal.50"
										: "white"
								}
								fontWeight={
									filterEntidad === entidad
										? "bold"
										: "normal"
								}
								_hover={{ bg: "teal.100" }}
							>
								{entidad}
							</MenuItem>
						))}
					</MenuList>
				</Menu>
			</Box>

			<Box>
				<Text fontSize="sm" mb={2} fontWeight="medium" color="gray.600">
					Acción
				</Text>
				<Menu>
					<MenuButton
						as={Button}
						rightIcon={<ChevronDownIcon />}
						colorScheme="purple"
						variant="outline"
						width="200px"
						textAlign="left"
						fontWeight="medium"
					>
						{filterAccion === "Todas"
							? "Todas"
							: ACCIONES[filterAccion]?.label || filterAccion}
					</MenuButton>
					<MenuList maxH="300px" overflowY="auto">
						{accionesUnicas.map((accion) => (
							<MenuItem
								key={accion}
								onClick={() => setFilterAccion(accion)}
								bg={
									filterAccion === accion
										? "purple.50"
										: "white"
								}
								fontWeight={
									filterAccion === accion ? "bold" : "normal"
								}
								_hover={{ bg: "purple.100" }}
							>
								{accion === "Todas"
									? "Todas"
									: ACCIONES[accion]?.label || accion}
							</MenuItem>
						))}
					</MenuList>
				</Menu>
			</Box>
		</Flex>
	);
}
