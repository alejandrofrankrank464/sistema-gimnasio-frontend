"use client";

import {
	Button,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	PopoverArrow,
	VStack,
	Badge,
} from "@chakra-ui/react";

export default function ClientePopover({
	clientes,
	colorScheme = "teal",
	buttonText,
	getPagoActivo,
	dayDate,
	showVIPBadge = false,
}) {
	return (
		<Popover trigger="click" placement="auto">
			<PopoverTrigger>
				<Button
					size="sm"
					colorScheme={colorScheme}
					variant="solid"
					borderRadius="full"
					minW="60px"
				>
					{buttonText}
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<PopoverArrow />
				<PopoverBody>
					<VStack align="stretch" spacing={1}>
						{clientes.map((cliente) => {
							const pago = getPagoActivo(cliente.id, dayDate);
							const isVIP =
								showVIPBadge &&
								pago?.TipoServicio === "VIP + Zumba y Box";
							return (
								<Badge
									key={cliente.id}
									colorScheme={isVIP ? "purple" : colorScheme}
									p={2}
									borderRadius="md"
								>
									{cliente.Name} {cliente.LastName}
									{isVIP && " (VIP)"}
								</Badge>
							);
						})}
					</VStack>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
}
