import { Box, Flex, Button, Text, VStack, HStack } from "@chakra-ui/react";

export default function DeleteAllDialog({
	isOpen,
	onClose,
	cancelRef,
	logsLength,
	deletingAll,
	handleDeleteAllLogs,
}) {
	if (!isOpen) return null;

	return (
		<>
			{/* Overlay */}
			<Box
				position="fixed"
				top="0"
				left="0"
				right="0"
				bottom="0"
				bg="blackAlpha.600"
				zIndex="1400"
				onClick={!deletingAll ? onClose : undefined}
			/>
			{/* Dialog */}
			<Flex
				position="fixed"
				top="0"
				left="0"
				right="0"
				bottom="0"
				alignItems="center"
				justifyContent="center"
				zIndex="1401"
				pointerEvents="none"
			>
				<Box
					bg="white"
					borderRadius="md"
					boxShadow="xl"
					maxW="md"
					w="90%"
					p={6}
					pointerEvents="auto"
				>
					<VStack spacing={4} align="stretch">
						<Text fontSize="lg" fontWeight="bold">
							Eliminar Todos los Registros
						</Text>
						<Text>
							¿Estás seguro? Esta acción eliminará permanentemente
							todos los {logsLength} registros de actividad. No se
							puede deshacer.
						</Text>
						<HStack spacing={3} justifyContent="flex-end">
							<Button
								ref={cancelRef}
								onClick={onClose}
								isDisabled={deletingAll}
							>
								Cancelar
							</Button>
							<Button
								colorScheme="red"
								onClick={handleDeleteAllLogs}
								isLoading={deletingAll}
							>
								Eliminar
							</Button>
						</HStack>
					</VStack>
				</Box>
			</Flex>
		</>
	);
}
