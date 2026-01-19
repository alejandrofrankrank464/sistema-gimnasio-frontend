import { Flex, Text, HStack, Button } from "@chakra-ui/react";

export default function ClientesPagination({
	currentPage,
	setCurrentPage,
	totalPages,
	pageSize,
	totalCount,
}) {
	return (
		<Flex justify="space-between" align="center" mt={4}>
			<Text fontSize="sm" color="gray.600">
				Mostrando {(currentPage - 1) * pageSize + 1} -{" "}
				{Math.min(currentPage * pageSize, totalCount)} de {totalCount}{" "}
				clientes
			</Text>
			<HStack spacing={2}>
				<Button
					size="sm"
					onClick={() => setCurrentPage(1)}
					isDisabled={currentPage === 1}
				>
					Primera
				</Button>
				<Button
					size="sm"
					onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
					isDisabled={currentPage === 1}
				>
					Anterior
				</Button>
				<Text fontSize="sm" px={3}>
					Página {currentPage} de {totalPages}
				</Text>
				<Button
					size="sm"
					onClick={() =>
						setCurrentPage((p) => Math.min(totalPages, p + 1))
					}
					isDisabled={currentPage === totalPages}
				>
					Siguiente
				</Button>
				<Button
					size="sm"
					onClick={() => setCurrentPage(totalPages)}
					isDisabled={currentPage === totalPages}
				>
					Última
				</Button>
			</HStack>
		</Flex>
	);
}
