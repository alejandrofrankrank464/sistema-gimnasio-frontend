import {
	Flex,
	Box,
	Text,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Button,
	Badge,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { MONTHS } from "./constants";
import { formatMonto } from "./formatters";

export default function PagosFilters({
	selectedYear,
	setSelectedYear,
	selectedMonth,
	setSelectedMonth,
	years,
	totalMonto,
}) {
	return (
		<Flex gap={4} mb={6} align="center">
			<Box>
				<Text fontSize="sm" mb={2} fontWeight="medium" color="gray.600">
					Año
				</Text>
				<Menu>
					<MenuButton
						as={Button}
						rightIcon={<ChevronDownIcon />}
						colorScheme="purple"
						variant="outline"
						width="150px"
						textAlign="left"
						fontWeight="medium"
					>
						{selectedYear}
					</MenuButton>
					<MenuList maxH="300px" overflowY="auto">
						{years.map((year) => (
							<MenuItem
								key={year}
								onClick={() => setSelectedYear(year)}
								bg={
									selectedYear === year
										? "purple.50"
										: "white"
								}
								fontWeight={
									selectedYear === year ? "bold" : "normal"
								}
								_hover={{ bg: "purple.100" }}
							>
								{year}
							</MenuItem>
						))}
					</MenuList>
				</Menu>
			</Box>
			<Box>
				<Text fontSize="sm" mb={2} fontWeight="medium" color="gray.600">
					Mes
				</Text>
				<Menu>
					<MenuButton
						as={Button}
						rightIcon={<ChevronDownIcon />}
						colorScheme="teal"
						variant="outline"
						width="200px"
						textAlign="left"
						fontWeight="medium"
					>
						{MONTHS[selectedMonth]}
					</MenuButton>
					<MenuList maxH="300px" overflowY="auto">
						{MONTHS.map((month, index) => (
							<MenuItem
								key={index}
								onClick={() => setSelectedMonth(index)}
								bg={
									selectedMonth === index
										? "teal.50"
										: "white"
								}
								fontWeight={
									selectedMonth === index ? "bold" : "normal"
								}
								_hover={{ bg: "teal.100" }}
							>
								{month}
							</MenuItem>
						))}
					</MenuList>
				</Menu>
			</Box>
			<Box mt={6}>
				<Badge
					colorScheme="purple"
					fontSize="lg"
					p={2}
					borderRadius="md"
				>
					Total: {formatMonto(totalMonto)}
				</Badge>
			</Box>
		</Flex>
	);
}
