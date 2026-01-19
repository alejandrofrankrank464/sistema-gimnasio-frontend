"use client";

import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

export default function HorarioHeader() {
	const router = useRouter();

	return (
		<Box>
			<Button
				leftIcon={<ArrowBackIcon />}
				variant="ghost"
				onClick={() => router.push("/home")}
				mb={4}
			>
				Volver al inicio
			</Button>
			<Heading size="lg">Horario Semanal</Heading>
			<Text color="gray.600" mt={2}>
				Lunes a Viernes: Turnos regulares | Sábado: Zumba y Box
			</Text>
		</Box>
	);
}
