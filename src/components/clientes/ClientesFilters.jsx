import { Flex, Input, ButtonGroup, Button, Select } from "@chakra-ui/react";
import { PAGE_SIZES } from "./constants";

export default function ClientesFilters({
	searchTerm,
	setSearchTerm,
	filterVip,
	setFilterVip,
	filterZumbaBox,
	setFilterZumbaBox,
	pageSize,
	setPageSize,
}) {
	return (
		<Flex gap={4} mb={4} align="center" wrap="wrap">
			<Input
				placeholder="Buscar por nombre, teléfono o email..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				maxW="400px"
			/>
			<ButtonGroup size="sm" isAttached variant="outline">
				<Button
					onClick={() => setFilterVip("all")}
					bg={filterVip === "all" ? "teal.500" : "transparent"}
					color={filterVip === "all" ? "white" : "gray.700"}
					borderColor={filterVip === "all" ? "teal.500" : "gray.300"}
					boxShadow={
						filterVip === "all"
							? "0 0 0 3px rgba(56, 178, 172, 0.3)"
							: "none"
					}
					zIndex={filterVip === "all" ? 1 : 0}
					_hover={{
						bg: filterVip === "all" ? "teal.600" : "gray.50",
					}}
					transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				>
					Todos
				</Button>
				<Button
					onClick={() => setFilterVip("vip")}
					bg={filterVip === "vip" ? "teal.500" : "transparent"}
					color={filterVip === "vip" ? "white" : "gray.700"}
					borderColor={filterVip === "vip" ? "teal.500" : "gray.300"}
					boxShadow={
						filterVip === "vip"
							? "0 0 0 3px rgba(56, 178, 172, 0.3)"
							: "none"
					}
					zIndex={filterVip === "vip" ? 1 : 0}
					_hover={{
						bg: filterVip === "vip" ? "teal.600" : "gray.50",
					}}
					transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				>
					VIP
				</Button>
				<Button
					onClick={() => setFilterVip("normal")}
					bg={filterVip === "normal" ? "teal.500" : "transparent"}
					color={filterVip === "normal" ? "white" : "gray.700"}
					borderColor={
						filterVip === "normal" ? "teal.500" : "gray.300"
					}
					boxShadow={
						filterVip === "normal"
							? "0 0 0 3px rgba(56, 178, 172, 0.3)"
							: "none"
					}
					zIndex={filterVip === "normal" ? 1 : 0}
					_hover={{
						bg: filterVip === "normal" ? "teal.600" : "gray.50",
					}}
					transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				>
					Normal
				</Button>
			</ButtonGroup>
			<ButtonGroup size="sm" isAttached variant="outline">
				<Button
					onClick={() => setFilterZumbaBox("all")}
					bg={filterZumbaBox === "all" ? "purple.500" : "transparent"}
					color={filterZumbaBox === "all" ? "white" : "gray.700"}
					borderColor={
						filterZumbaBox === "all" ? "purple.500" : "gray.300"
					}
					boxShadow={
						filterZumbaBox === "all"
							? "0 0 0 3px rgba(159, 122, 234, 0.3)"
							: "none"
					}
					zIndex={filterZumbaBox === "all" ? 1 : 0}
					_hover={{
						bg: filterZumbaBox === "all" ? "purple.600" : "gray.50",
					}}
					transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				>
					Todos
				</Button>
				<Button
					onClick={() => setFilterZumbaBox("ambos")}
					bg={
						filterZumbaBox === "ambos"
							? "purple.500"
							: "transparent"
					}
					color={filterZumbaBox === "ambos" ? "white" : "gray.700"}
					borderColor={
						filterZumbaBox === "ambos" ? "purple.500" : "gray.300"
					}
					boxShadow={
						filterZumbaBox === "ambos"
							? "0 0 0 3px rgba(159, 122, 234, 0.3)"
							: "none"
					}
					zIndex={filterZumbaBox === "ambos" ? 1 : 0}
					_hover={{
						bg:
							filterZumbaBox === "ambos"
								? "purple.600"
								: "gray.50",
					}}
					transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				>
					Ambos
				</Button>
				<Button
					onClick={() => setFilterZumbaBox("zumba")}
					bg={
						filterZumbaBox === "zumba"
							? "purple.500"
							: "transparent"
					}
					color={filterZumbaBox === "zumba" ? "white" : "gray.700"}
					borderColor={
						filterZumbaBox === "zumba" ? "purple.500" : "gray.300"
					}
					boxShadow={
						filterZumbaBox === "zumba"
							? "0 0 0 3px rgba(159, 122, 234, 0.3)"
							: "none"
					}
					zIndex={filterZumbaBox === "zumba" ? 1 : 0}
					_hover={{
						bg:
							filterZumbaBox === "zumba"
								? "purple.600"
								: "gray.50",
					}}
					transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				>
					Zumba
				</Button>
				<Button
					onClick={() => setFilterZumbaBox("box")}
					bg={filterZumbaBox === "box" ? "purple.500" : "transparent"}
					color={filterZumbaBox === "box" ? "white" : "gray.700"}
					borderColor={
						filterZumbaBox === "box" ? "purple.500" : "gray.300"
					}
					boxShadow={
						filterZumbaBox === "box"
							? "0 0 0 3px rgba(159, 122, 234, 0.3)"
							: "none"
					}
					zIndex={filterZumbaBox === "box" ? 1 : 0}
					_hover={{
						bg: filterZumbaBox === "box" ? "purple.600" : "gray.50",
					}}
					transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				>
					Box
				</Button>
				<Button
					onClick={() => setFilterZumbaBox("no")}
					bg={filterZumbaBox === "no" ? "purple.500" : "transparent"}
					color={filterZumbaBox === "no" ? "white" : "gray.700"}
					borderColor={
						filterZumbaBox === "no" ? "purple.500" : "gray.300"
					}
					boxShadow={
						filterZumbaBox === "no"
							? "0 0 0 3px rgba(159, 122, 234, 0.3)"
							: "none"
					}
					zIndex={filterZumbaBox === "no" ? 1 : 0}
					_hover={{
						bg: filterZumbaBox === "no" ? "purple.600" : "gray.50",
					}}
					transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				>
					No
				</Button>
			</ButtonGroup>
			<Select
				maxW="150px"
				value={pageSize}
				size="sm"
				onChange={(e) => setPageSize(Number(e.target.value))}
			>
				{PAGE_SIZES.map((size) => (
					<option key={size} value={size}>
						{size} por página
					</option>
				))}
			</Select>
		</Flex>
	);
}
