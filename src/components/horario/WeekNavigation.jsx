"use client";

import { Button, Flex, VStack, Text, Card, CardBody } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export default function WeekNavigation({
	weekDays,
	onPrevious,
	onNext,
	onCurrentWeek,
}) {
	const formatDate = (date) => {
		return date.toLocaleDateString("es-ES", {
			day: "numeric",
			month: "short",
		});
	};

	return (
		<Card>
			<CardBody>
				<Flex justify="space-between" align="center">
					<Button
						leftIcon={<ChevronLeftIcon />}
						onClick={onPrevious}
						size="sm"
					>
						Anterior
					</Button>
					<VStack spacing={0}>
						<Text fontWeight="semibold" fontSize="lg">
							{formatDate(weekDays[0])} -{" "}
							{formatDate(weekDays[5])}
						</Text>
						<Button
							variant="link"
							size="sm"
							colorScheme="teal"
							onClick={onCurrentWeek}
						>
							Ir a semana actual
						</Button>
					</VStack>
					<Button
						rightIcon={<ChevronRightIcon />}
						onClick={onNext}
						size="sm"
					>
						Siguiente
					</Button>
				</Flex>
			</CardBody>
		</Card>
	);
}
