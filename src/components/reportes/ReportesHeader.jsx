import { Flex, Heading, HStack, Button } from "@chakra-ui/react";
import { ArrowBackIcon, DeleteIcon } from "@chakra-ui/icons";

export default function ReportesHeader({
	router,
	fetchLogs,
	loading,
	onOpenDelete,
	logsLength,
	deletingAll,
}) {
	return (
		<Flex justify="space-between" align="center" mb={6}>
			<Heading size="lg">Registro de Actividades</Heading>
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
					colorScheme="teal"
					onClick={fetchLogs}
					isLoading={loading}
				>
					Actualizar
				</Button>
				<Button
					colorScheme="red"
					variant="outline"
					leftIcon={<DeleteIcon />}
					onClick={onOpenDelete}
					isDisabled={logsLength === 0 || loading || deletingAll}
				>
					Eliminar Todos
				</Button>
			</HStack>
		</Flex>
	);
}
