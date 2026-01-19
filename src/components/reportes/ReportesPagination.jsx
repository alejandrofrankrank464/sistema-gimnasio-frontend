import { Flex, Text, HStack, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export default function ReportesPagination({
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
				registros
			</Text>
			<HStack spacing={2}>
				<IconButton
					icon={<ChevronLeftIcon />}
					onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
					isDisabled={currentPage === 1}
					size="sm"
					aria-label="Página anterior"
				/>
				<Text fontSize="sm" fontWeight="medium">
					Página {currentPage} de {totalPages}
				</Text>
				<IconButton
					icon={<ChevronRightIcon />}
					onClick={() =>
						setCurrentPage((p) => Math.min(totalPages, p + 1))
					}
					isDisabled={currentPage === totalPages}
					size="sm"
					aria-label="Página siguiente"
				/>
			</HStack>
		</Flex>
	);
}
