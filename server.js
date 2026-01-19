// front/server.js
const next = require("next");
const express = require("express");
const path = require("path");

const dev = false; // producción
const app = next({ dev });
const handle = app.getRequestHandler();

// Puerto desde variable de entorno o 3000
const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
	const server = express();

	// Servir archivos estáticos si los necesitas
	server.use("/public", express.static(path.join(__dirname, "public")));

	// Todas las rutas van a Next.js (expresión regular en vez de '*')
	server.all(/.*/, (req, res) => handle(req, res));

	server.listen(PORT, () => {
		console.log(`Next.js SSR corriendo en http://localhost:${PORT}`);
	});
});
