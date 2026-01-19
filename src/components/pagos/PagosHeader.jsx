import { Flex, Heading, HStack, Button } from "@chakra-ui/react";
import { ArrowBackIcon, AddIcon } from "@chakra-ui/icons";

export default function PagosHeader({ router, onOpenCreate }) {
	return (
		<Flex justify="space-between" align="center" mb={6}>
			<Heading size="lg">Gestión de Pagos</Heading>
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
					Registrar Pago
				</Button>
			</HStack>
		</Flex>
	);
}
