import { Flex, Heading, HStack, Button } from "@chakra-ui/react";
import { AddIcon, ArrowBackIcon } from "@chakra-ui/icons";

export default function ClientesHeader({ router, onOpenCreate }) {
	return (
		<Flex justify="space-between" align="center" mb={6}>
			<Heading size="lg">Lista de Clientes</Heading>
			<HStack spacing={3}>
				<Button
					leftIcon={<ArrowBackIcon />}
					colorScheme="gray"
					variant="outline"
					onClick={() => router.push("/home")}
				>
					Volver al Inicio
				</Button>
				<Button
					leftIcon={<AddIcon />}
					colorScheme="teal"
					onClick={onOpenCreate}
				>
					Nuevo Cliente
				</Button>
			</HStack>
		</Flex>
	);
}
